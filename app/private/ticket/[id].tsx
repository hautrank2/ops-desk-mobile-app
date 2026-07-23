import { ticketApis } from "@/apis/ticket";
import { TicketForm } from "@/components/ticket/TicketForm";
import { TicketCommentSection } from "@/components/ticket/TicketCommentSection";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Images } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, View, TouchableOpacity, ScrollView } from "react-native";

const EditTicketScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "comments">("info");

  const { isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketApis.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <Text>Ticket not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-0">
      {/* Action Row */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2 border-b border-outline-100 bg-background-0">
        {/* Tab Controls */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("info")}
            className={`px-3 py-1.5 rounded-full ${
              activeTab === "info" ? "bg-primary-600" : "bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "info" ? "text-typography-0" : "text-typography-600"
              }`}
            >
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("comments")}
            className={`px-3 py-1.5 rounded-full ${
              activeTab === "comments" ? "bg-primary-600" : "bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "comments" ? "text-typography-0" : "text-typography-600"
              }`}
            >
              Comments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manage Images Button */}
        <Button
          size="xs"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: "/private/ticket/images",
              params: { id },
            })
          }
        >
          <ButtonIcon as={Images} className="mr-1" />
          <ButtonText>Images</ButtonText>
        </Button>
      </View>

      {/* Tab Contents */}
      <View className="flex-1">
        {activeTab === "info" ? (
          <TicketForm ticketId={id} />
        ) : (
          <ScrollView className="flex-1 px-4 py-2">
            <TicketCommentSection ticketId={id} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default EditTicketScreen;
