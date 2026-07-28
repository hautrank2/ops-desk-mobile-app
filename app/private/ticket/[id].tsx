import { assetItemApis } from "@/apis/asset-item";
import { ticketApis } from "@/apis/ticket";
import { TicketCommentSection } from "@/components/ticket/TicketCommentSection";
import { TicketForm } from "@/components/ticket/TicketForm";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { AssetItemModel } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckSquare,
  Images,
  Plus,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"info" | "comments" | "items">(
    "info",
  );

  // Modal states for adding items
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemIdsToAdd, setSelectedItemIdsToAdd] = useState<string[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Ticket Detail Query
  const { data: ticketData, isLoading: isLoadingTicket } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketApis.getById(id!),
    enabled: !!id,
  });

  // Ticket Items Query
  const { data: ticketItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["ticket-items", id],
    queryFn: () => ticketApis.getItems(id!),
    enabled: !!id && activeTab === "items",
  });

  // System-wide available asset items for selection query
  const { data: allAssetItems = [] } = useQuery<AssetItemModel[]>({
    queryKey: ["get", "asset-items-all", "populate-asset"],
    queryFn: async () => {
      const res = await assetItemApis.getList({ populations: ["assetId"] });
      return res.items || [];
    },
    enabled: isAddModalOpen,
  });

  // Filter out items already associated with this ticket
  const availableAssetItems = useMemo(() => {
    const existingIds = new Set(ticketItems.map((item) => item._id));
    return allAssetItems.filter((item) => !existingIds.has(item._id));
  }, [allAssetItems, ticketItems]);

  // Apply search query filter
  const filteredAvailableItems = useMemo(() => {
    if (!searchQuery) return availableAssetItems;
    const query = searchQuery.toLowerCase();
    return availableAssetItems.filter((item) => {
      const assetName =
        typeof item.assetId === "object" ? item.assetId.name : "Asset";
      const codeLabel = item._id.slice(-6).toUpperCase();
      const sn = item.serialNumber || "";
      return (
        assetName.toLowerCase().includes(query) ||
        codeLabel.toLowerCase().includes(query) ||
        sn.toLowerCase().includes(query)
      );
    });
  }, [availableAssetItems, searchQuery]);

  // Mutations
  const addItemsMutation = useMutation({
    mutationFn: (itemIds: string[]) => ticketApis.addItems(id!, itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-items", id] });
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["get", "asset-items-all"] });
      setIsAddModalOpen(false);
      setSelectedItemIdsToAdd([]);
      setSearchQuery("");
      Alert.alert("Success", "Items added successfully!");
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.message || "Failed to add items");
    },
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

  const handleToggleSelect = (itemId: string) => {
    setSelectedItemIdsToAdd((prev) =>
      prev.includes(itemId)
        ? prev.filter((x) => x !== itemId)
        : [...prev, itemId],
    );
  };

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
                activeTab === "info"
                  ? "text-typography-0"
                  : "text-typography-600"
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
                activeTab === "comments"
                  ? "text-typography-0"
                  : "text-typography-600"
              }`}
            >
              Comments
            </Text>
          </TouchableOpacity>
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
        {activeTab === "info" && <TicketForm ticketId={id} />}

        {activeTab === "comments" && (
          <ScrollView className="flex-1 px-4 py-2">
            <TicketCommentSection ticketId={id} />
          </ScrollView>
        )}

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
                  {ticketItems.map((item) => {
                    const assetName =
                      typeof item.assetId === "object"
                        ? item.assetId.name
                        : "Asset";
                    const codeLabel = item._id.slice(-6).toUpperCase();

                    return (
                      <View
                        key={item._id}
                        className="flex-row justify-between items-center p-4 bg-background-0 rounded-lg mb-3 border border-outline-100 shadow-sm"
                      >
                        <View className="flex-1 pr-2">
                          <Text className="font-bold text-typography-900 text-base">
                            {assetName}
                          </Text>
                          <Text className="text-xs text-typography-500 mt-1">
                            ID: {codeLabel}{" "}
                            {item.serialNumber
                              ? `· SN: ${item.serialNumber}`
                              : ""}
                          </Text>
                          <View className="flex-row mt-2">
                            <View className="px-2 py-0.5 rounded bg-warning-50 border border-warning-100">
                              <Text className="text-[10px] font-bold text-warning-700">
                                {item.status}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Button
                          size="xs"
                          variant="outline"
                          action="negative"
                          onPress={() => handleRemoveItem(item._id)}
                          isDisabled={removeItemsMutation.isPending}
                        >
                          <ButtonIcon as={Trash2} />
                        </Button>
                      </View>
                    );
                  })}
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

            {/* Search Input bar */}
            <View className="my-3 flex-row items-center bg-background-50 border border-outline-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-typography-400 mr-2" />
              <Input className="flex-1 border-0 h-8">
                <InputField
                  placeholder="Search available assets..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="p-0 text-sm"
                />
              </Input>
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={16} className="text-typography-400" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Available list */}
            <View className="flex-1">
              {filteredAvailableItems.length === 0 ? (
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-typography-400 text-sm">
                    No matching assets found
                  </Text>
                </View>
              ) : (
                <ScrollView className="flex-1">
                  {filteredAvailableItems.map((item) => {
                    const assetName =
                      typeof item.assetId === "object"
                        ? item.assetId.name
                        : "Asset";
                    const codeLabel = item._id.slice(-6).toUpperCase();
                    const isSelected = selectedItemIdsToAdd.includes(item._id);

                    return (
                      <TouchableOpacity
                        key={item._id}
                        onPress={() => handleToggleSelect(item._id)}
                        className={`flex-row items-center p-3 border-b border-outline-100 ${
                          isSelected ? "bg-primary-50/40" : ""
                        }`}
                      >
                        <View className="mr-3">
                          {isSelected ? (
                            <CheckSquare
                              size={20}
                              className="text-primary-600"
                            />
                          ) : (
                            <Square size={20} className="text-typography-400" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-typography-900 text-sm">
                            {assetName}
                          </Text>
                          <Text className="text-xs text-typography-500 mt-0.5">
                            ID: {codeLabel}{" "}
                            {item.serialNumber
                              ? `· SN: ${item.serialNumber}`
                              : ""}
                          </Text>
                        </View>
                        <View className="px-2 py-0.5 rounded bg-success-50 border border-success-100">
                          <Text className="text-[10px] font-bold text-success-700">
                            {item.status}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* Footer Actions */}
            <View className="flex-row justify-between items-center pt-4 border-t border-outline-100 mt-2">
              <Text className="text-sm font-semibold text-typography-600">
                Selected: {selectedItemIdsToAdd.length}
              </Text>
              <View className="flex-row gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setIsAddModalOpen(false)}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  size="sm"
                  disabled={
                    selectedItemIdsToAdd.length === 0 ||
                    addItemsMutation.isPending
                  }
                  onPress={() => addItemsMutation.mutate(selectedItemIdsToAdd)}
                >
                  {addItemsMutation.isPending && (
                    <ButtonSpinner className="mr-2" />
                  )}
                  <ButtonText>Add Selected</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetailTicketScreen;
