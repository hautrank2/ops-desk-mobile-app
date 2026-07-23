import { Stack } from "expo-router";
import React from "react";

export default function TicketStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Ticket" }} />
      <Stack.Screen name="add" options={{ title: "Create Ticket" }} />
      <Stack.Screen name="[id]" options={{ title: "Ticket Details" }} />
      <Stack.Screen name="images" options={{ title: "Manage Images" }} />
    </Stack>
  );
}
