import { runCapture } from "./shell.mjs";

/**
 * Store-clean Android status bar for captures — the Android twin of the iOS
 * `simctl status_bar override` (9:41, full signal/battery, no notification icons).
 * Uses SystemUI demo mode and turns heads-up banners off so in-app reminders
 * (e.g. "Achievement unlocked") do not cover the screen being captured.
 */
const DEMO_ACTION = "com.android.systemui.demo";

function demo(adb, command, extras = []) {
  runCapture(adb, [
    "shell",
    "am",
    "broadcast",
    "-a",
    DEMO_ACTION,
    "-e",
    "command",
    command,
    ...extras,
  ]);
}

export function enterCleanStatusBar(adb) {
  runCapture(adb, ["shell", "settings", "put", "global", "sysui_demo_allowed", "1"]);
  runCapture(adb, ["shell", "settings", "put", "global", "heads_up_notifications_enabled", "0"]);
  demo(adb, "enter");
  demo(adb, "clock", ["-e", "hhmm", "0941"]);
  demo(adb, "battery", [
    "-e",
    "level",
    "100",
    "-e",
    "plugged",
    "false",
    "-e",
    "powersave",
    "false",
  ]);
  // `fully true` drops the "no internet" (!) badge. Mobile is hidden: the emulator
  // keeps a "3G" data-type label whatever `datatype` is set to.
  demo(adb, "network", ["-e", "wifi", "show", "-e", "level", "4", "-e", "fully", "true"]);
  demo(adb, "network", ["-e", "mobile", "hide"]);
  demo(adb, "notifications", ["-e", "visible", "false"]);
}

export function exitCleanStatusBar(adb) {
  demo(adb, "exit");
  runCapture(adb, ["shell", "settings", "put", "global", "heads_up_notifications_enabled", "1"]);
}
