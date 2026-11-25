import ExpoModulesCore
import Foundation
import SwiftUI
import TajweedFormer

/// Rejection carrying the SDK's stable `TajweedError.code` ("needs_connection", …).
/// SDK 4.0.2's `TajweedError.cause` travels in the message as `[needs=model|lease stage=… reason=…]`
/// tokens (never a URL or an identifier), which the JS client parses.
final class TajweedFailure: Exception {
  private let sdkCode: String
  private let detail: String

  init(_ code: String, _ detail: String) {
    self.sdkCode = code
    self.detail = detail
    super.init()
  }

  override var code: String { sdkCode }
  override var reason: String { detail }
}

/// Quran Lab TajweedFormer bridge (SDK 4.x). Four calls: Client, model, listen, read.
///
/// SDK 4 (D66): anonymous analytics and error reports are always on (the
/// `analytics:` option no longer exists), and the SDK itself asks every learner,
/// at most three times and never in the install's first 24 hours, whether to
/// share recordings — it presents its own sheet over the front view controller.
/// This module never calls `sharing.ask()`; it themes that sheet to match the app
/// and exposes the learner's switch, "Delete what I shared" and the recovery code.
/// The app version and build are read by the SDK from the bundle.
public final class MunibTajweedformerModule: Module {
  private var client: TajweedClient?
  private var model: TajweedModel?
  private var session: TajweedSession?
  private var takeTasks: [Task<Void, Never>] = []

  // Expo Modules lifecycle hook (SDK 58 replacement for the deprecated `OnDestroy`).
  public override func willDestroy() {
    cancelTakeTasks()
    client?.close()
  }

  public func definition() -> ModuleDefinition {
    Name("MunibTajweedformer")

    Events("onProgress", "onChunk", "onEnded")

    AsyncFunction("configure") { (key: String, theme: [String: String]?) in
      if self.client != nil { return }
      do {
        let client = try TajweedClient(key: key)
        if let theme, let sharingTheme = Self.sharingTheme(theme) {
          client.sharing.theme = sharingTheme
        }
        self.client = client
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("prefetch") { () async throws in
      let client = try self.requireClient()
      do {
        try await client.prefetch(onProgress: { [weak self] done, total in
          self?.sendEvent("onProgress", ["done": Double(done), "total": Double(total)])
        })
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("openModel") { () async throws -> [String: Any?] in
      let model = try await self.openModel()
      let calibration: String? = model.calibration.flatMap { String(data: $0.data, encoding: .utf8) }
      return [
        "version": model.version,
        "build": model.build,
        "defaultContext": model.defaultContext,
        "calibrationJson": calibration,
      ]
    }

    // Warms the engine for the drill's heads before the first take (official docs: a
    // Session with non-default heads otherwise gets its engine when its first take opens,
    // "too late for that take to start on the Neural Engine"). Returns the backend kind.
    AsyncFunction("prepareTake") { (heads: [String]) async throws -> String in
      let model = try await self.openModel()
      do {
        let backend = try await model.prepare(options: TajweedSessionOptions(heads: heads))
        return "\(backend.kind)"
      } catch {
        throw Self.failure(error)
      }
    }

    // `client.diagnose()`: the SDK's own support report (no audio, text or identifiers).
    AsyncFunction("diagnose") { () async -> String? in
      guard let client = self.client else { return nil }
      return String(describing: await client.diagnose())
    }

    AsyncFunction("startTake") { (heads: [String], endOnSilenceMs: Int) async throws in
      await self.cancelTakeQuietly()
      let model = try await self.openModel()
      let options = TajweedSessionOptions(
        heads: heads,
        endOnSilenceMs: endOnSilenceMs > 0 ? endOnSilenceMs : nil
      )
      let take: TajweedSession
      do {
        take = try await model.listen(options: options)
      } catch {
        throw Self.failure(error)
      }
      self.session = take
      let chunkTask = Task { [weak self] in
        for await chunk in take.chunks {
          self?.sendEvent("onChunk", [
            "speech": chunk.speech,
            "text": chunk.decoded.text,
            "index": chunk.index,
          ])
        }
      }
      let eventTask = Task { [weak self] in
        for await event in take.events {
          guard let ended = Self.endedPayload(event) else { continue }
          self?.sendEvent("onEnded", ended)
        }
      }
      self.takeTasks = [chunkTask, eventTask]
    }

    AsyncFunction("finishTake") { () async throws -> [String: Any] in
      guard let take = self.session else {
        throw TajweedFailure("session_closed", "No take is open")
      }
      defer {
        self.session = nil
        self.cancelTakeTasks()
      }
      do {
        let heads = try await take.finish()
        var out: [[String: Any]] = []
        for name in heads.names {
          guard let head = heads[name] else { continue }
          out.append([
            "name": head.name,
            "frameMs": head.frameMs,
            "frames": head.frames,
            "classes": head.classes,
            "values": head.values.map { Double($0) },
          ])
        }
        return ["heads": out]
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("cancelTake") { () async in
      await self.cancelTakeQuietly()
    }

    AsyncFunction("removeModels") { () async throws in
      await self.cancelTakeQuietly()
      self.model = nil
      let client = try self.requireClient()
      do {
        try client.removeModels()
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("storageBytes") { () -> Double in
      guard let client = self.client else { return 0 }
      return Self.modelBytes(client.storage)
    }

    AsyncFunction("sharingState") { () throws -> [String: Any?] in
      let sharing = try self.requireClient().sharing
      return [
        "isAvailable": sharing.isAvailable,
        "isOn": sharing.isOn,
        "recoveryCode": sharing.recoveryCode,
      ]
    }

    AsyncFunction("setSharingOn") { (on: Bool) async throws in
      let client = try self.requireClient()
      do {
        try await client.sharing.setOn(on)
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("deleteShared") { () async throws -> Bool in
      let client = try self.requireClient()
      do {
        try await client.sharing.delete()
        return true
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("close") { () async in
      await self.cancelTakeQuietly()
      self.model = nil
      self.client?.close()
      self.client = nil
    }
  }

  // MARK: - Helpers

  private func requireClient() throws -> TajweedClient {
    guard let client = self.client else {
      throw TajweedFailure("invalid_argument", "configure(key) was not called")
    }
    return client
  }

  private func openModel() async throws -> TajweedModel {
    if let model = self.model { return model }
    let client = try requireClient()
    do {
      let model = try await client.model()
      self.model = model
      return model
    } catch {
      throw Self.failure(error)
    }
  }

  private func cancelTakeTasks() {
    for task in takeTasks { task.cancel() }
    takeTasks = []
  }

  private func cancelTakeQuietly() async {
    if let take = session {
      await take.cancel()
    }
    session = nil
    cancelTakeTasks()
  }

  /// Maps any thrown error to a coded rejection. SDK errors keep their stable code.
  private static func failure(_ error: Error) -> Exception {
    if let failure = error as? TajweedFailure { return failure }
    if let sdk = error as? TajweedError {
      return TajweedFailure(sdk.code, causeTokens(sdk.cause) + sdk.message)
    }
    return TajweedFailure("engine_failed", error.localizedDescription)
  }

  /// `[needs=… stage=… reason=… http=…] ` prefix for the JS side; empty without a cause.
  private static func causeTokens(_ cause: TajweedError.Cause?) -> String {
    guard let cause else { return "" }
    var parts = ["stage=\(cause.stage)", "reason=\(cause.reason)"]
    if let needs = cause.needs { parts.insert("needs=\(needs)", at: 0) }
    if let status = cause.httpStatus { parts.append("http=\(status)") }
    return "[" + parts.joined(separator: " ") + "] "
  }

  /// The SDK's own sharing sheet in the app's colours (`#RRGGBB` strings from JS).
  /// Only colours change: the sheet's words, structure and consent version never do.
  private static func sharingTheme(_ theme: [String: String]) -> SharingTheme? {
    guard let accent = color(theme["accent"]) else { return nil }
    var out = SharingTheme(accent: accent)
    if let background = color(theme["background"]) { out.background = background }
    if let text = color(theme["text"]) { out.text = text }
    if let secondary = color(theme["secondaryText"]) { out.secondaryText = secondary }
    return out
  }

  private static func color(_ hex: String?) -> Color? {
    guard var raw = hex?.trimmingCharacters(in: .whitespaces), raw.hasPrefix("#") else { return nil }
    raw.removeFirst()
    guard raw.count == 6, let value = UInt32(raw, radix: 16) else { return nil }
    return Color(
      red: Double((value >> 16) & 0xFF) / 255,
      green: Double((value >> 8) & 0xFF) / 255,
      blue: Double(value & 0xFF) / 255
    )
  }

  /// `ended` events → `{ reason, errorCode }`. Read through reflection so this does
  /// not depend on how many associated values `.ended` carries in this SDK build.
  private static func endedPayload(_ event: TajweedEvent) -> [String: Any?]? {
    let mirror = Mirror(reflecting: event)
    guard let child = mirror.children.first, child.label == "ended" else { return nil }
    let described = String(describing: child.value).lowercased()
    let reasons = ["silence", "background", "interrupted", "sourceend", "limit", "error", "hidden"]
    let compact = described.replacingOccurrences(of: "_", with: "")
    let reason = reasons.first { compact.contains($0) } ?? "error"
    var errorCode: String?
    if reason == "error" {
      for case let sdk as TajweedError in Mirror(reflecting: child.value).children.map({ $0.value }) {
        errorCode = "\(sdk.code)"
      }
      if errorCode == nil, let sdk = child.value as? TajweedError {
        errorCode = "\(sdk.code)"
      }
    }
    return ["reason": reason == "hidden" ? "background" : reason, "errorCode": errorCode]
  }

  /// Sum of model bytes from `client.storage` (`models: [{ bytes }]`); 0 when unknown.
  private static func modelBytes(_ storage: Any) -> Double {
    var total = 0.0
    for child in Mirror(reflecting: storage).children where child.label == "models" {
      for model in Mirror(reflecting: child.value).children {
        for field in Mirror(reflecting: model.value).children where field.label == "bytes" {
          if let n = field.value as? Int64 { total += Double(n) }
          else if let n = field.value as? Int { total += Double(n) }
          else if let n = field.value as? Double { total += n }
        }
      }
    }
    return total
  }
}
