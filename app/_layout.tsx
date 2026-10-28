import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AllProviders } from "@/providers";
import { useAuthCtx } from "@/store/auth";
import "../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export const unstable_settings = {
  anchor: "private",
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
  const { isAuthenticated } = useAuthCtx();

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Expense app" }}
        />
        <Stack.Screen name="login" options={{ title: "Login" }} />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="private" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};
