import { authApi } from "@/apis/auth";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthCtx } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AtSign,
  BadgeCheck,
  Building2,
  Calendar,
  LogOut,
  Mail,
  Shield,
  User,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

type InfoRowProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string | null;
};

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <View className="flex-row items-center gap-3">
    <View className="w-9 h-9 rounded-lg bg-background-50 border border-outline-100 justify-center items-center">
      <Icon size={18} className="text-typography-500" />
    </View>
    <View className="flex-1">
      <Text className="text-typography-500 text-xs">{label}</Text>
      <Text
        className="text-typography-900 text-sm font-semibold"
        numberOfLines={1}
      >
        {value || "N/A"}
      </Text>
    </View>
  </View>
);

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return format(date, "dd MMM yyyy");
};

const ProfileScreen = () => {
  const { payload, onLogout } = useAuthCtx();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: !!payload?.token,
  });

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: onLogout },
    ]);
  };

  const displayName = profile?.name || payload?.username || "Username";
  const role = profile?.role || payload?.role || "user";
  const status = profile?.status;

  console.log("profile", profile);

  return (
    <View className="flex-1 bg-background-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header card */}
        <View className="bg-background-0 rounded-2xl p-6 border border-outline-100 shadow-sm mt-2 items-center">
          <View className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 justify-center items-center mb-3">
            <User size={36} className="text-primary-600" />
          </View>
          <Text className="text-xl font-bold text-typography-900">
            {displayName}
          </Text>

          <View className="flex-row items-center gap-2 mt-2">
            <View className="px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
              <Text className="text-xs font-semibold text-primary-700 capitalize">
                {role}
              </Text>
            </View>
            {status && (
              <View
                className={`px-3 py-1 rounded-full border ${
                  status === "active"
                    ? "bg-success-50 border-success-100"
                    : "bg-error-50 border-error-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold capitalize ${
                    status === "active" ? "text-success-700" : "text-error-700"
                  }`}
                >
                  {status}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact information */}
        <Text className="text-typography-500 text-xs font-semibold uppercase mt-6 mb-3 px-1">
          Contact
        </Text>
        <View className="bg-background-0 rounded-2xl p-5 border border-outline-100 shadow-sm gap-4">
          <InfoRow icon={Mail} label="Email" value={profile?.email} />
          <InfoRow
            icon={AtSign}
            label="Username"
            value={profile?.username || payload?.username}
          />
        </View>

        {/* Account information */}
        <Text className="text-typography-500 text-xs font-semibold uppercase mt-6 mb-3 px-1">
          Account
        </Text>
        <View className="bg-background-0 rounded-2xl p-5 border border-outline-100 shadow-sm gap-4">
          <InfoRow icon={Shield} label="Role" value={role} />
          {status && (
            <InfoRow icon={BadgeCheck} label="Status" value={status} />
          )}
          {profile?.deptId && (
            <InfoRow
              icon={Building2}
              label="Department"
              value={profile.deptId}
            />
          )}
          <InfoRow
            icon={Calendar}
            label="Member since"
            value={formatDate(profile?.createdAt)}
          />
        </View>

        {isLoading && (
          <View className="items-center mt-4">
            <ActivityIndicator size="small" />
          </View>
        )}
      </ScrollView>

      {/* Logout button pinned at the bottom */}
      <View className="px-6 pb-6 pt-2 bg-background-50">
        <Button
          size="md"
          action="negative"
          onPress={handleLogout}
          className="flex-row justify-center items-center py-3 bg-error-600 rounded-xl"
        >
          <ButtonIcon as={LogOut} className="mr-2" />
          <ButtonText className="font-bold text-typography-0">
            Log Out
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;
