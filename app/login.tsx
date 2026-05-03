import { LoginForm } from "@/components/auth/LoginForm";
import { Heading } from "@/components/ui/heading";
import { useAuthCtx } from "@/store/auth";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const LoginPage = () => {
  const { onAuthticate } = useAuthCtx();
  const router = useRouter();

  return (
    <View className="flex-1 p-4">
      <Heading size="xl">Login</Heading>

      <View className="mt-2">
        <LoginForm
          afterSuccess={async (result) => {
            if (result._id) {
              await onAuthticate(result);
              router.navigate("/private/asset");
            }
          }}
        />
      </View>
    </View>
  );
};

export default LoginPage;
