import { TicketImageSection } from "@/components/ticket/TicketImageSection";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const TicketImagesScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <Text className="text-typography-500">Ticket not found</Text>
      </View>
    );
  }

  return <TicketImageSection ticketId={id} />;
};

export default TicketImagesScreen;
