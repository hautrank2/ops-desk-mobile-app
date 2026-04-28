import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthCtx } from "@/store/auth";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const LoginPage = () => {
  const { onAuthticate } = useAuthCtx();

  return (
    <View className="p-2">
      <Text variant="titleLarge">Login</Text>

      <LoginForm
        afterSuccess={(result) => {
          if (result._id) {
            onAuthticate(result);
          }
        }}
      />
    </View>
  );
};

export default LoginPage;
