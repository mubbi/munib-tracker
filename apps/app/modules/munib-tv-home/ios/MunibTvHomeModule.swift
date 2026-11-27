import ExpoModulesCore
#if os(tvOS)
import TVServices
#endif

/// Key the Top Shelf extension reads (`tv-targets/top-shelf/ContentProvider.swift`).
let tvHomePayloadKey = "munib.tvHome.payload"

/// Apple TV: hands the TV home payload to the Top Shelf extension through the shared
/// App Group, then asks tvOS to reload the shelf. Android-only functions (launcher
/// channel, speech prompt) report unsupported — tvOS dictation is built into the
/// system keyboard (Siri Remote microphone), so no in-app recognizer is needed.
public class MunibTvHomeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MunibTvHome")

    Function("isChannelSupported") { false }

    AsyncFunction("publishChannel") { (_: String) -> Bool in false }

    AsyncFunction("clearChannel") {}

    Function("isTopShelfSupported") { () -> Bool in
      #if os(tvOS)
      return true
      #else
      return false
      #endif
    }

    AsyncFunction("publishTopShelf") { (payloadJson: String, appGroup: String) -> Bool in
      #if os(tvOS)
      // Without the App Group entitlement this returns nil, or a container the
      // extension cannot see — either way the shelf falls back to the static image.
      guard
        FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroup) != nil,
        let defaults = UserDefaults(suiteName: appGroup)
      else {
        return false
      }
      defaults.set(payloadJson, forKey: tvHomePayloadKey)
      TVTopShelfContentProvider.topShelfContentDidChange()
      return true
      #else
      return false
      #endif
    }

    Function("isVoiceSearchAvailable") { false }

    AsyncFunction("startVoiceSearch") { (_: String?, _: String?) -> String? in nil }
  }
}
