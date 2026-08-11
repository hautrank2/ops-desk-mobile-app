import { Icon } from "@/components/ui/icon";
import { useAuthCtx } from "@/store/auth";
import { Tabs } from "expo-router";
import {
  BoxIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SlidersHorizontalIcon,
  TicketIcon,
  User,
} from "lucide-react-native";

export default function RootLayout() {
  const { payload } = useAuthCtx();
  const isAdmin = payload?.role === "admin";

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Icon as={LayoutDashboardIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="asset"
        options={{
          title: "Asset",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={BoxIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="asset-item"
        options={{
          title: "Asset Items",
          tabBarIcon: ({ color }) => <Icon as={PackageIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: "Ticket",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={TicketIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          headerShown: false,
          // Admin-only: hide from the tab bar and block navigation for others
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Icon as={SlidersHorizontalIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Icon as={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
