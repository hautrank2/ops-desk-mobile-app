import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import {
  BoxIcon,
  LayoutDashboardIcon,
  PackageIcon,
  TicketIcon,
} from "lucide-react-native";

export default function RootLayout() {
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
          tabBarIcon: ({ color }) => <Icon as={TicketIcon} color={color} />,
        }}
      />
    </Tabs>
  );
}
