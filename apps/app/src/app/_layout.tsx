import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { MunibThemeProvider } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <MunibThemeProvider>
      <AnimatedSplashOverlay />
      <AppTabs />
    </MunibThemeProvider>
  );
}
