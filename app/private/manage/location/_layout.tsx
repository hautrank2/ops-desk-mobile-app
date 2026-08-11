import { Stack } from "expo-router";

export default function LocationStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Locations" }} />
      <Stack.Screen name="add" options={{ title: "Create Location" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Location" }} />
    </Stack>
  );
}
