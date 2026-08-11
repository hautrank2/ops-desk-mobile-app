import { Stack } from "expo-router";

// Admin-only management section: Users, Departments, Locations
export default function ManageStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Manage" }} />
      <Stack.Screen name="user" options={{ headerShown: false }} />
      <Stack.Screen name="department" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerShown: false }} />
    </Stack>
  );
}
