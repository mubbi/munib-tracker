import ExpoModulesCore
import UIKit

/// Seasonal app icons (NF-2.23b). The alternate icon sets are compiled from
/// `AppIcon-<id>.appiconset` (see app.plugin.js); JS passes the bare `<id>`.
///
/// iOS only allows the change while the app is active, and always confirms it with
/// a system alert ("You have changed the icon for …") — there is no public way to
/// suppress it, so JS switches at most once per season boundary.
public class MunibAppIconModule: Module {
  private static let prefix = "AppIcon-"

  public func definition() -> ModuleDefinition {
    Name("MunibAppIcon")

    AsyncFunction("isSupported") { () -> Bool in
      MainActor.assumeIsolated { UIApplication.shared.supportsAlternateIcons }
    }.runOnQueue(.main)

    /// The active alternate icon id, or nil for the primary icon.
    AsyncFunction("getIconName") { () -> String? in
      MainActor.assumeIsolated { Self.id(fromAlternateName: UIApplication.shared.alternateIconName) }
    }.runOnQueue(.main)

    /// Switches to `name` (nil = primary icon). Resolves true when the icon changed,
    /// false when it already was `name`; rejects while the app is not in the foreground.
    AsyncFunction("setIconName") { (name: String?, promise: Promise) in
      MainActor.assumeIsolated {
        let app = UIApplication.shared
        guard app.supportsAlternateIcons else {
          promise.reject("ERR_APP_ICON_UNSUPPORTED", "Alternate app icons are not supported on this device.")
          return
        }
        let target = name.map { Self.prefix + $0 }
        if app.alternateIconName == target {
          promise.resolve(false)
          return
        }
        guard app.applicationState == .active else {
          promise.reject("ERR_APP_ICON_INACTIVE", "The app icon can only change while the app is in the foreground.")
          return
        }
        app.setAlternateIconName(target) { error in
          if let error {
            promise.reject("ERR_APP_ICON", error.localizedDescription)
          } else {
            promise.resolve(true)
          }
        }
      }
    }.runOnQueue(.main)
  }

  private static func id(fromAlternateName name: String?) -> String? {
    guard let name else { return nil }
    return name.hasPrefix(prefix) ? String(name.dropFirst(prefix.count)) : name
  }
}
