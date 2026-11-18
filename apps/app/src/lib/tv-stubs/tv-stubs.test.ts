/**
 * Metro swaps these stubs in for phone-only native modules when `EXPO_TV=1`.
 * Every capability must report "unavailable" without crashing callers.
 */
import { Linking } from "react-native";

import * as appleAuth from "./expo-apple-authentication";
import * as documentPicker from "./expo-document-picker";
import * as haptics from "./expo-haptics";
import * as hinge from "./expo-hinge";
import * as imagePicker from "./expo-image-picker";
import * as localAuth from "./expo-local-authentication";
import * as location from "./expo-location";
import * as navigationBar from "./expo-navigation-bar";
import * as notifications from "./expo-notifications";
import * as quickActions from "./expo-quick-actions";
import * as sensors from "./expo-sensors";
import * as sharing from "./expo-sharing";
import * as speech from "./expo-speech";
import * as speechRecognition from "./expo-speech-recognition";
import * as storeReview from "./expo-store-review";
import * as webBrowser from "./expo-web-browser";
import * as ort from "./onnxruntime-react-native";
import * as androidWidget from "./react-native-android-widget";
import WebViewDefault, { WebView } from "./react-native-webview";

const DENIED = { status: "denied", granted: false, canAskAgain: false };
const CANCELED = { canceled: true, assets: null };

describe.each([
  ["apple authentication", () => appleAuth.isAvailableAsync()],
  ["local authentication hardware", () => localAuth.hasHardwareAsync()],
  ["local authentication enrolment", () => localAuth.isEnrolledAsync()],
  ["quick actions", () => quickActions.isSupported()],
  ["magnetometer", () => sensors.Magnetometer.isAvailableAsync()],
  ["sharing", () => sharing.isAvailableAsync()],
  ["speech", () => speech.isSpeakingAsync()],
  ["store review", () => storeReview.isAvailableAsync()],
  ["store review action", () => storeReview.hasAction()],
])("%s", (_name, probe) => {
  it("reports unavailable", async () => {
    expect(await probe()).toBe(false);
  });
});

describe.each([
  ["notification permissions", () => notifications.getPermissionsAsync()],
  ["notification permission request", () => notifications.requestPermissionsAsync()],
  ["exact alarm permissions", () => notifications.getExactAlarmPermissionsAsync()],
  ["exact alarm request", () => notifications.requestExactAlarmPermissionsAsync()],
  ["location permissions", () => location.getForegroundPermissionsAsync()],
  ["location permission request", () => location.requestForegroundPermissionsAsync()],
  ["camera permission", () => imagePicker.requestCameraPermissionsAsync()],
  ["library permission", () => imagePicker.requestMediaLibraryPermissionsAsync()],
])("%s", (_name, request) => {
  it("is denied", async () => {
    expect(await request()).toEqual(DENIED);
  });
});

describe.each([
  ["document picker", () => documentPicker.getDocumentAsync()],
  ["image library", () => imagePicker.launchImageLibraryAsync()],
  ["camera", () => imagePicker.launchCameraAsync()],
])("%s", (_name, pick) => {
  it("is canceled", async () => {
    expect(await pick()).toEqual(CANCELED);
  });
});

describe.each([
  ["Apple sign-in", () => appleAuth.signInAsync(), "unavailable on TV"],
  ["current position", () => location.getCurrentPositionAsync(), "unavailable on TV"],
  ["push token", () => notifications.getExpoPushTokenAsync(), "unavailable on TV"],
  ["share", () => sharing.shareAsync("file:///x"), "unavailable on TV"],
  ["ONNX session", () => ort.InferenceSession.create(), "unavailable on TV"],
])("%s", (_name, call, message) => {
  it("rejects", async () => {
    await expect(call()).rejects.toThrow(message);
  });
});

describe("no-op listeners", () => {
  it.each([
    ["hinge", () => hinge.addHingeListener(jest.fn())],
    ["quick actions", () => quickActions.addListener(jest.fn())],
    ["magnetometer", () => sensors.Magnetometer.addListener(jest.fn())],
    ["notification received", () => notifications.addNotificationReceivedListener(jest.fn())],
    [
      "notification response",
      () => notifications.addNotificationResponseReceivedListener(jest.fn()),
    ],
    ["heading", () => location.watchHeadingAsync(jest.fn())],
  ])("%s subscriptions can be removed", async (_name, subscribe) => {
    const sub = await subscribe();
    expect(() => sub.remove()).not.toThrow();
  });
});

describe("notifications stub", () => {
  it("schedules nothing", async () => {
    expect(await notifications.scheduleNotificationAsync({})).toBe("tv-noop");
    expect(await notifications.getAllScheduledNotificationsAsync()).toEqual([]);
    expect(await notifications.setNotificationChannelAsync("c", {})).toBeNull();
    expect(notifications.getLastNotificationResponse()).toBeNull();
    await notifications.cancelScheduledNotificationAsync("x");
    await notifications.cancelAllScheduledNotificationsAsync();
    notifications.clearLastNotificationResponse();
    notifications.setNotificationHandler(null);
    expect(notifications.default.AndroidImportance.MAX).toBe(7);
  });
});

describe("misc stubs", () => {
  it("hinge, location and auth readers return empty values", async () => {
    expect(hinge.isAvailable()).toBe(false);
    expect(hinge.getHinge()).toBeNull();
    expect(hinge.useHinge()).toBeNull();
    expect(await location.getLastKnownPositionAsync()).toBeNull();
    expect(await location.reverseGeocodeAsync({ latitude: 0, longitude: 0 })).toEqual([]);
    expect(await appleAuth.getCredentialStateAsync("u")).toBe(0);
    expect(await localAuth.supportedAuthenticationTypesAsync()).toEqual([]);
    expect(await localAuth.authenticateAsync()).toEqual({ success: false, error: "not_available" });
  });

  it("haptics, navigation bar and speech resolve silently", async () => {
    await haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    await haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    await haptics.selectionAsync();
    expect(navigationBar.NavigationBar({})).toBeNull();
    await navigationBar.setVisibilityAsync("hidden");
    await navigationBar.setBackgroundColorAsync("#000");
    await navigationBar.setButtonStyleAsync("light");
    await speech.stop();
    await speech.pause();
    await speech.resume();
    expect(await speech.getAvailableVoicesAsync()).toEqual([]);
    await quickActions.setItems([]);
    await storeReview.requestReview();
    sensors.Magnetometer.setUpdateInterval(100);
  });

  it("reports a speech error through the callback", () => {
    const onError = jest.fn();
    speech.speak("salam", { onError });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Speech unavailable on TV" }),
    );
    expect(() => speech.speak("salam")).not.toThrow();
  });

  it("never offers speech recognition", async () => {
    const module = speechRecognition.ExpoSpeechRecognitionModule;
    expect(module.isRecognitionAvailable()).toBe(false);
    expect(await module.requestPermissionsAsync()).toEqual({ granted: false, canAskAgain: false });
    module.start();
    module.stop();
    module.abort();
  });

  it("refuses ONNX tensors and renders widgets as nothing", async () => {
    expect(() => new ort.Tensor()).toThrow("unavailable on TV");
    expect(androidWidget.FlexWidget({})).toBeNull();
    expect(androidWidget.TextWidget({})).toBeNull();
    androidWidget.registerWidgetTaskHandler(jest.fn());
    await androidWidget.requestWidgetUpdate({ widgetName: "x", renderWidget: () => null });
  });

  it("renders WebView as a plain View", () => {
    expect(WebView).toBe(WebViewDefault);
  });
});

describe("web browser stub", () => {
  it("opens URLs with Linking", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    expect(await webBrowser.openBrowserAsync("https://x")).toEqual({ type: "opened" });
    expect(openURL).toHaveBeenCalledWith("https://x");
  });

  it("reports cancel when Linking fails", async () => {
    jest.spyOn(Linking, "openURL").mockRejectedValueOnce(new Error("no handler"));
    expect(await webBrowser.openBrowserAsync("https://x")).toEqual({ type: "cancel" });
  });

  it("has no auth sessions or custom tabs", async () => {
    expect(await webBrowser.openAuthSessionAsync("https://x")).toEqual({ type: "cancel" });
    expect(webBrowser.maybeCompleteAuthSession()).toEqual({
      type: "failed",
      message: "unavailable on TV",
    });
    expect(await webBrowser.dismissBrowser()).toEqual({ type: "dismiss" });
    webBrowser.dismissAuthSession();
    expect(await webBrowser.warmUpAsync()).toEqual({});
    expect(await webBrowser.coolDownAsync()).toEqual({});
    expect(await webBrowser.mayInitWithUrlAsync()).toEqual({});
    expect(await webBrowser.getCustomTabsSupportingBrowsersAsync()).toEqual({});
  });
});
