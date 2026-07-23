import { TicketForm } from "@/components/ticket/TicketForm";
import React from "react";
import { View } from "react-native";

const AddTicketScreen = () => {
  return (
    <View className="flex-1 bg-background-0">
      <TicketForm />
    </View>
  );
};

export default AddTicketScreen;
