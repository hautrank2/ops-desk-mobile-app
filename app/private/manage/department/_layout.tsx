import { Stack } from "expo-router";

export default function DepartmentStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Departments" }} />
      <Stack.Screen name="add" options={{ title: "Create Department" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Department" }} />
    </Stack>
  );
}
