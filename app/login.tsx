import { LoginForm } from "@/components/auth/LoginForm";
import { Heading } from "@/components/ui/heading";
import { useAuthCtx } from "@/store/auth";
import React from "react";
import { View } from "react-native";

const LoginPage = () => {
  const { onAuthticate } = useAuthCtx();

  return (
    <View className="flex-1 p-4">
      <Heading size="xl">Login</Heading>

      <View className="mt-2">
        <LoginForm
          afterSuccess={async (result) => {
            if (result._id) {
              // Chỉ cần cập nhật trạng thái auth.
              // <Stack.Protected> trong app/_layout.tsx sẽ tự chuyển
              // khỏi màn login sang nhóm "private" khi guard bật lên.
              await onAuthticate(result);
            }
          }}
        />
      </View>
    </View>
  );
};

export default LoginPage;
