import AppIntents
import SwiftUI
import WidgetKit

// iOS 18 controls: Control Center, the Lock Screen bottom slots and the Action
// button. Controls have no timeline — they refresh when tapped or when the app
// calls `ControlCenter.shared.reloadAllControls()`. Keep them to one tap.

/// "Mark Salah" — marks the Salah whose time is running, in the background
/// (same App Group queue + Darwin notification as the widget button).
@available(iOS 18.0, *)
struct MarkSalahControl: ControlWidget {
  static let kind = "app.munibtracker.control.markSalah"

  var body: some ControlWidgetConfiguration {
    StaticControlConfiguration(kind: Self.kind) {
      ControlWidgetButton(action: MarkCurrentSalahWidgetIntent()) {
        Label {
          Text(LocalizedStringResource("control.markSalah.label", defaultValue: "Mark Salah"))
        } icon: {
          Image(systemName: "checkmark.circle")
        }
      }
    }
    .displayName(LocalizedStringResource("control.markSalah.label", defaultValue: "Mark Salah"))
    .description(
      LocalizedStringResource(
        "control.markSalah.description",
        defaultValue: "Mark the Salah whose time has begun as prayed."
      )
    )
  }
}

/// Which screen the "Open" control launches (chosen when adding the control).
@available(iOS 18.0, *)
struct OpenFeatureControlConfiguration: ControlConfigurationIntent {
  static let title: LocalizedStringResource = "Choose a screen"

  @Parameter(title: "Screen", default: .qibla)
  var feature: MunibFeature

  init() {}
}

/// "Open Qibla / Tasbeeh / Qur'an / …" — opens the chosen screen.
@available(iOS 18.0, *)
struct OpenFeatureControl: ControlWidget {
  static let kind = "app.munibtracker.control.open"

  var body: some ControlWidgetConfiguration {
    AppIntentControlConfiguration(kind: Self.kind, intent: OpenFeatureControlConfiguration.self) {
      configuration in
      ControlWidgetButton(action: OpenFeatureIntent(feature: configuration.feature)) {
        Label {
          Text(configuration.feature.title)
        } icon: {
          Image(systemName: configuration.feature.symbol)
        }
      }
    }
    .displayName(LocalizedStringResource("control.open.label", defaultValue: "Open in Munib Tracker"))
    .description(
      LocalizedStringResource(
        "control.open.description",
        defaultValue: "Open Qibla, Tasbeeh, Qur'an or another screen in one tap."
      )
    )
  }
}

@available(iOS 18.0, *)
struct MunibControlsBundle: WidgetBundle {
  var body: some Widget {
    MarkSalahControl()
    OpenFeatureControl()
  }
}
