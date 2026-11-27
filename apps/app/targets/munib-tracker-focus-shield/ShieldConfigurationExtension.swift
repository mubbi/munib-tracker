import ManagedSettings
import ManagedSettingsUI
import UIKit

/// NF-3.13: the Salah shield — "It's time for {prayer}", the primary action
/// ("I've prayed", or "I'll pray now" in gentle mode) and, while any are left
/// today, the emergency unlock. Copy and theme colours come from the plan the
/// app wrote to the App Group (localised in JS; no user content).
class ShieldConfigurationExtension: ShieldConfigurationDataSource {
  override func configuration(shielding application: Application) -> ShieldConfiguration {
    makeConfiguration()
  }

  override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
    makeConfiguration()
  }

  override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
    makeConfiguration()
  }

  override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
    makeConfiguration()
  }

  private func color(_ hex: String, fallback: UIColor) -> UIColor {
    guard let (r, g, b) = FocusLockShared.rgb(hex) else { return fallback }
    return UIColor(red: r, green: g, blue: b, alpha: 1)
  }

  private func makeConfiguration() -> ShieldConfiguration {
    guard let plan = FocusLockShared.loadPlan() else { return ShieldConfiguration() }
    let window = FocusLockShared.activeWindow() ?? plan.windows.first
    let labels = plan.config.labels
    let theme = plan.config.theme
    let foreground = color(theme.foreground, fallback: .label)
    let accent = color(theme.accent, fallback: .systemGreen)
    let onAccent = color(theme.accentForeground, fallback: .white)

    let left = FocusLockShared.emergencyLeft()
    let emergency: ShieldConfiguration.Label? = left > 0 && !labels.emergency.isEmpty
      ? .init(text: labels.emergency[min(left, labels.emergency.count - 1)], color: accent)
      : nil
    let primary = plan.config.unlockMode == "gentle" ? labels.prayNow : labels.prayed

    return ShieldConfiguration(
      backgroundBlurStyle: .systemMaterial,
      backgroundColor: color(theme.background, fallback: .systemBackground),
      icon: UIImage(systemName: "moon.stars.fill")?.withTintColor(accent, renderingMode: .alwaysOriginal),
      title: .init(text: window?.title ?? "", color: foreground),
      subtitle: .init(text: window?.body ?? "", color: color(theme.muted, fallback: .secondaryLabel)),
      primaryButtonLabel: .init(text: primary, color: onAccent),
      primaryButtonBackgroundColor: accent,
      secondaryButtonLabel: emergency
    )
  }
}
