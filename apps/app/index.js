/**
 * App entry — register Android widget headless task before Expo Router loads.
 * Headless widget updates do not mount app/_layout, so registration must happen here.
 */
import "./src/lib/request-idle-callback-polyfill";
import { registerAndroidWidgetTaskHandler } from "./src/lib/appSurfaces/widgets/androidTaskHandler";

registerAndroidWidgetTaskHandler();

require("expo-router/entry");
