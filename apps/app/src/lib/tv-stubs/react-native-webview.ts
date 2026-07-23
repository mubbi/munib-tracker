/**
 * Metro resolves `react-native-webview` here when `EXPO_TV=1`.
 * WKWebView / Android WebView are not linked on Apple TV / Leanback.
 */
import { View } from "react-native";

export const WebView = View;
export default WebView;
