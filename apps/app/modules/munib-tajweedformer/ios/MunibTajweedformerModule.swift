import ExpoModulesCore
import Foundation
import TajweedFormer

/// Rejection carrying the SDK's stable `TajweedError.code` ("needs_connection", …).
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

/// Quran Lab TajweedFormer bridge (Phase 6). Four calls: Client, model, listen, read.
///
/// Privacy: this module never offers recitation sharing. It does not call
/// `sharing.ask()` and hosts no `SharingConsentView`, `SharingSettingsView` or
/// `.quranLabSharing(_:)` modifier, so the SDK has nowhere to show its consent
/// sheet from this app. It only exposes the learner's off switch, "Delete what I
/// shared" and the recovery code. Analytics are off (`.off`).
public final class MunibTajweedformerModule: Module {
  private var client: TajweedClient?
  private var model: TajweedModel?
  private var session: TajweedSession?
  private var takeTasks: [Task<Void, Never>] = []

  public func definition() -> ModuleDefinition {
    Name("MunibTajweedformer")

    Events("onProgress", "onChunk", "onEnded")

    OnDestroy {
      self.cancelTakeTasks()
      self.client?.close()
    }

    AsyncFunction("configure") { (key: String) in
      if self.client != nil { return }
      do {
        self.client = try TajweedClient(key: key, options: TajweedClientOptions(analytics: .off))
      } catch {
        throw Self.failure(error)
      }
    }

    AsyncFunction("prefetch") { () async throws in
      let client = try self.requireClient()
      do {
        try await client.prefetch(unmeteredOnly: false, onProgress: { [weak self] done, total in
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
      return TajweedFailure("\(sdk.code)", sdk.localizedDescription)
    }
    return TajweedFailure("engine_failed", error.localizedDescription)
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
