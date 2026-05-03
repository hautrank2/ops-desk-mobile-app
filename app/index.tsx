import { Button, ButtonText } from "@/components/ui/button";
import { useAuthCtx } from "@/store/auth";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const Screen = () => {
  const { isAuthenticated } = useAuthCtx();

  // if (isAuthenticated) {
  //   return <Redirect href="/overview/recent" />;
  // }

  // if (isAuthenticated) {
  //   return <Redirect href="/place" />;
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Track your expenses easily and stay in control of your money.
      </Text>

      <View style={styles.actions}>
        <Button variant="solid" onPress={() => router.push("/login")}>
          <ButtonText>
            Login
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  actions: {
    width: "100%",
    gap: 12,
    marginTop: 12,
  },
});
