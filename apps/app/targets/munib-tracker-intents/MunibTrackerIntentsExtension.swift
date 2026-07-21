import AppIntents

/// ExtensionKit entry point — required for App Store validation (`__swift5_entry`).
/// Background mark intents live in `_shared/MunibAppIntents.swift` (also compiled
/// into the main app). Foreground intents + `AppShortcutsProvider` are app-only
/// (`#if !MUNIB_INTENTS_EXTENSION`) because Shortcuts fails with "internal error"
/// when `openAppWhenRun` / App Shortcuts run from an extension-only intent.
@main
struct MunibTrackerIntentsExtension: AppIntentsExtension {}
