import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthCtx } from "@/store/auth";
import { LogOut, User } from "lucide-react-native";
import React from "react";
import { View, Alert } from "react-native";

const ProfileScreen = () => {
  const { payload, onLogout } = useAuthCtx();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background-50 p-6 justify-between">
      <View className="bg-background-0 rounded-2xl p-6 border border-outline-100 shadow-sm mt-4">
        {/* User Avatar */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 justify-center items-center mb-3">
            <User size={36} className="text-primary-600" />
          </View>
          <Text className="text-xl font-bold text-typography-900">
            {payload?.username || "Username"}
          </Text>
          <Text className="text-sm text-typography-500 mt-1 capitalize">
            Role: {payload?.role || "User"}
          </Text>
        </View>

        {/* Details list */}
        <View className="border-t border-outline-100 pt-4 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-typography-500 text-sm">Account ID</Text>
            <Text className="text-typography-800 text-sm font-semibold">
              {payload?._id || "N/A"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-typography-500 text-sm">Username</Text>
            <Text className="text-typography-800 text-sm font-semibold">
              {payload?.username || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout button at the bottom */}
      <View className="mb-6">
        <Button
          size="md"
          action="negative"
          onPress={handleLogout}
          className="flex-row justify-center items-center py-3 bg-error-600 rounded-xl"
        >
          <ButtonIcon as={LogOut} className="mr-2" />
          <ButtonText className="font-bold text-typography-0">Log Out</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;
