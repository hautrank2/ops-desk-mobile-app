import { ticketApis } from "@/apis/ticket";
import { AddItemToTicket } from "@/components/ticket/AddItemToTicket";
import { TicketAssetTree } from "@/components/ticket/TicketAssetTree";
import { TicketCommentSection } from "@/components/ticket/TicketCommentSection";
import { TicketForm } from "@/components/ticket/TicketForm";
import { TicketImageSection } from "@/components/ticket/TicketImageSection";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const DetailTicketScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "info" | "comments" | "items" | "images"
  >("items");

  // Modal states for adding items
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Ticket Detail Query
  const { data: ticketData, isLoading: isLoadingTicket } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketApis.getById(id!),
    enabled: !!id,
  });

  // Ticket Items Query — populate assetId so we can render an asset → items tree
  const { data: ticketItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["ticket-items", id],
    queryFn: () => ticketApis.getItems(id!, ["assetId"]),
    enabled: !!id && activeTab === "items",
  });

  const removeItemsMutation = useMutation({
    mutationFn: (itemIds: string[]) => ticketApis.removeItems(id!, itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-items", id] });
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["get", "asset-items-all"] });
      Alert.alert("Success", "Item removed successfully!");
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.message || "Failed to remove item");
    },
  });

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Confirm Remove",
      "Are you sure you want to remove this item from the ticket?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItemsMutation.mutate([itemId]),
        },
      ],
    );
  };

  if (isLoadingTicket) {
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
      {/* Dynamic Header Title */}
      <Stack.Screen
        options={{
          title: ticketData?.code
            ? `Ticket: ${ticketData.code}`
            : "Ticket Details",
        }}
      />

      {/* Action Row / Tab Selector */}
      <View className="ticket-detail-header px-4 pt-4 pb-2 border-b border-outline-100 bg-background-0">
        {/* Tab Controls */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("items")}
            className={`px-3 py-1.5 rounded-full ${
              activeTab === "items" ? "bg-primary-600" : "bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "items"
                  ? "text-typography-0"
                  : "text-typography-600"
              }`}
            >
              Items
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
                activeTab === "comments"
                  ? "text-typography-0"
                  : "text-typography-600"
              }`}
            >
              Comments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("images")}
            className={`px-3 py-1.5 rounded-full ${
              activeTab === "images" ? "bg-primary-600" : "bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "images"
                  ? "text-typography-0"
                  : "text-typography-600"
              }`}
            >
              Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("info")}
            className={`px-3 py-1.5 rounded-full ${
              activeTab === "info" ? "bg-primary-600" : "bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "info"
                  ? "text-typography-0"
                  : "text-typography-600"
              }`}
            >
              Info
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Contents */}
      <View className="flex-1">
        {activeTab === "info" && <TicketForm ticketId={id} />}

        {activeTab === "comments" && (
          <ScrollView className="flex-1 px-4 py-2">
            <TicketCommentSection ticketId={id} />
          </ScrollView>
        )}

        {activeTab === "images" && <TicketImageSection ticketId={id} />}

        {activeTab === "items" && (
          <View className="flex-1 p-4 bg-background-50">
            {isLoadingItems ? (
              <ActivityIndicator size="large" className="mt-10" />
            ) : ticketItems.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10 bg-background-0 rounded-lg p-6 border border-outline-100">
                <Text className="text-typography-500 mb-4 text-center">
                  No items associated with this ticket.
                </Text>
                <Button size="sm" onPress={() => setIsAddModalOpen(true)}>
                  <ButtonIcon as={Plus} className="mr-2" />
                  <ButtonText>Add Asset Items</ButtonText>
                </Button>
              </View>
            ) : (
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-typography-900">
                    Associated Items ({ticketItems.length})
                  </Text>
                  <Button size="sm" onPress={() => setIsAddModalOpen(true)}>
                    <ButtonIcon as={Plus} className="mr-2" />
                    <ButtonText>Add Item</ButtonText>
                  </Button>
                </View>

                <ScrollView className="flex-1">
                  <TicketAssetTree
                    items={ticketItems}
                    onRemoveItem={handleRemoveItem}
                    isRemoving={removeItemsMutation.isPending}
                  />
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Dynamic Add Items Bottom Sheet Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background-0 rounded-t-2xl p-4 h-[80%] pb-8">
            {/* Header */}
            <View className="flex-row justify-between items-center pb-4 border-b border-outline-100">
              <Text className="text-lg font-bold text-typography-900">
                Add Items to Ticket
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} className="text-typography-600" />
              </TouchableOpacity>
            </View>

            <AddItemToTicket />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetailTicketScreen;
