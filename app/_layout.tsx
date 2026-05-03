import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AllProviders } from "@/providers";
import { useAuthCtx } from "@/store/auth";
import "../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AllProviders>
          <StatusBar style="auto" />
          <RootStack />
        </AllProviders>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

const RootStack = () => {
  const authCtx = useAuthCtx();
  const { isAuthenticated } = authCtx;
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate("/private/asset");
    }
  }, [isAuthenticated, router]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Expense app" }}
      />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="private" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};
