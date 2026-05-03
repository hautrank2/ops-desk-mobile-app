import { Stack } from 'expo-router';

export default function AssetStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Asset" }} />
      <Stack.Screen name="add" options={{ title: "Create Asset" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit Asset" }} />
    </Stack>
  );
}
