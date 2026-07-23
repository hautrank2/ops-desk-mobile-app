import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { Images, Info, Package } from "lucide-react-native";

export default function AssetDetailLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="items"
        options={{
          title: "Items",
          tabBarIcon: ({ color }) => <Icon as={Package} color={color} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: ({ color }) => <Icon as={Info} color={color} />,
        }}
      />
      <Tabs.Screen
        name="images"
        options={{
          title: "Images",
          tabBarIcon: ({ color }) => <Icon as={Images} color={color} />,
        }}
      />
    </Tabs>
  );
}
