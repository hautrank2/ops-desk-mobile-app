import { Icon as GSIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import {
  Building2,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type Entry = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  path: "/private/manage/user" | "/private/manage/department" | "/private/manage/location";
};

const ENTRIES: Entry[] = [
  {
    title: "Users",
    subtitle: "Manage accounts, roles & status",
    icon: Users,
    accent: "bg-primary-600",
    path: "/private/manage/user",
  },
  {
    title: "Departments",
    subtitle: "Organizational units",
    icon: Building2,
    accent: "bg-info-600",
    path: "/private/manage/department",
  },
  {
    title: "Locations",
    subtitle: "Sites, floors & rooms",
    icon: MapPin,
    accent: "bg-success-600",
    path: "/private/manage/location",
  },
];

const ManageHubScreen = () => {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background-50"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-typography-500 text-xs font-semibold uppercase mt-2 mb-3 px-1">
        Administration
      </Text>

      <View className="gap-3">
        {ENTRIES.map((e) => (
          <TouchableOpacity
            key={e.title}
            onPress={() => router.push(e.path)}
            className="flex-row items-center gap-4 bg-background-0 rounded-2xl p-4 border border-outline-100 shadow-sm"
          >
            <View
              className={`w-11 h-11 rounded-xl justify-center items-center ${e.accent}`}
            >
              <GSIcon as={e.icon} size="md" className="text-typography-0" />
            </View>
            <View className="flex-1">
              <Text className="text-typography-900 font-semibold text-base">
                {e.title}
              </Text>
              <Text className="text-typography-500 text-xs mt-0.5">
                {e.subtitle}
              </Text>
            </View>
            <GSIcon
              as={ChevronRight}
              size="md"
              className="text-typography-400"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ManageHubScreen;
