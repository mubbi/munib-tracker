/**
 * App entry — register Android widget headless task before Expo Router loads.
 * Headless widget updates do not mount app/_layout, so registration must happen here.
 */
import "react-native-gesture-handler";
import "./src/lib/request-idle-callback-polyfill";
// Must run before the app tree mounts so OAuth redirect popups can close.
import "./src/lib/auth/auth-session-bootstrap";
import { registerAndroidWidgetTaskHandler } from "./src/lib/appSurfaces/widgets/androidTaskHandler";
import { initSentry } from "./src/lib/sentry";

initSentry();

registerAndroidWidgetTaskHandler();

require("expo-router/entry");
