import { Stack } from "expo-router";

export default function UserStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Users" }} />
      <Stack.Screen name="add" options={{ title: "Create User" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit User" }} />
    </Stack>
  );
}
