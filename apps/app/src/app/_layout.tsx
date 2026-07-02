import * as SplashScreen from "expo-splash-screen";

import "@/global.css";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { AppApiProvider } from "@/providers/api-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppApiProvider>
      <MunibThemeProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </MunibThemeProvider>
    </AppApiProvider>
  );
}
