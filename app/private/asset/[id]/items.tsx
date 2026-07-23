/* eslint-disable react/no-unescaped-entities */
import { assetApis } from "@/apis/asset";
import { assetItemApis } from "@/apis/asset-item";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { AssetItemModel, AssetItemStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ChevronDownIcon, Plus, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const STATUS_OPTIONS = Object.values(AssetItemStatus);

const STATUS_COLORS: Record<AssetItemStatus, string> = {
  [AssetItemStatus.Active]: "#16a34a",
  [AssetItemStatus.Faulty]: "#dc2626",
  [AssetItemStatus.Maintenance]: "#d97706",
  [AssetItemStatus.Retired]: "#6b7280",
};

const AssetItemsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const queryKey = ["get", "asset-item", "byAsset", id];

  const [showAddForm, setShowAddForm] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");

  // ─── Toast helper ────────────────────────────────────────────────────────────

  const showToast = useCallback(
    (action: "success" | "error", title: string, description: string) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: action === "success" ? "top" : "bottom",
        duration: 3000,
        render: ({ id: tid }) => (
          <Toast nativeID={"toast-" + tid} action={action} variant="solid">
            <VStack space="xs">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{description}</ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    },
    [toast],
  );

  // ─── Data ───────────────────────────────────────────────────────────────────

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      assetItemApis.getList({ assetId: id!, page: 1, pageSize: 100 }),
    enabled: !!id,
  });

  const items: AssetItemModel[] = data?.items ?? [];

  // ─── Create items mutation ───────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: () =>
      assetApis.createItems(id!, {
        quantity: Number(quantity),
        note: note || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast("success", "Success", "Items created successfully.");
      setQuantity("1");
      setNote("");
      setShowAddForm(false);
    },
    onError: (error: any) => {
      const msg = error?.message ?? "Failed to create items.";
      showToast("error", "Error", msg);
    },
  });

  const onSubmitCreate = () => {
    const qty = Number(quantity);
    if (!qty || qty < 1 || qty > 20) {
      showToast(
        "error",
        "Invalid quantity",
        "Quantity must be between 1 and 20.",
      );
      return;
    }
    createMutation.mutate();
  };

  // ─── Update status mutation ──────────────────────────────────────────────────

  const updateStatusMutation = useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: string;
      status: AssetItemStatus;
    }) => assetItemApis.update(itemId, { status }),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, (old: any) =>
        old
          ? {
              ...old,
              items: old.items.map((it: AssetItemModel) =>
                it._id === updated._id ? updated : it,
              ),
            }
          : old,
      );
      showToast("success", "Updated", "Item status updated.");
    },
    onError: (error: any) => {
      const msg = error?.message ?? "Failed to update item status.";
      showToast("error", "Error", msg);
    },
  });

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm text-gray-500">
          {items.length} item{items.length === 1 ? "" : "s"}
        </Text>

        <Button
          size="sm"
          variant="outline"
          onPress={() => setShowAddForm((v) => !v)}
        >
          <ButtonIcon as={showAddForm ? X : Plus} className="mr-2" />
          <ButtonText>{showAddForm ? "Cancel" : "Add Items"}</ButtonText>
        </Button>
      </View>

      {/* Add items form */}
      {showAddForm && (
        <View className="border border-gray-100 rounded-xl p-4 mb-4 bg-gray-50">
          <VStack space="md">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Quantity</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g. 5"
                  keyboardType="number-pad"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Note</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Optional note"
                  value={note}
                  onChangeText={setNote}
                />
              </Input>
            </FormControl>

            <Button
              onPress={onSubmitCreate}
              isDisabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <ActivityIndicator className="mr-2" />
              )}
              <ButtonText>Create</ButtonText>
            </Button>
          </VStack>
        </View>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <View className="items-center justify-center py-20">
          <Text className="text-gray-400 text-base text-center">
            No items yet. Tap "Add Items" to create some.
          </Text>
        </View>
      ) : (
        <VStack space="sm">
          {items.map((item) => {
            const isUpdating =
              updateStatusMutation.isPending &&
              updateStatusMutation.variables?.itemId === item._id;

            return (
              <View
                key={item._id}
                className="border border-gray-100 rounded-xl p-3 bg-white"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-bold text-gray-800">{item.code}</Text>

                  <View className="w-[150px]">
                    <Select
                      selectedValue={item.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({
                          itemId: item._id,
                          status: status as AssetItemStatus,
                        })
                      }
                      isDisabled={isUpdating}
                    >
                      <SelectTrigger
                        variant="outline"
                        size="sm"
                        className="justify-between"
                      >
                        <SelectInput
                          placeholder="Status"
                          value={item.status}
                          style={{ color: STATUS_COLORS[item.status] }}
                        />
                        {isUpdating ? (
                          <ActivityIndicator size="small" className="mr-3" />
                        ) : (
                          <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        )}
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              label={status}
                              value={status}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </View>
                </View>

                {!!item.serialNumber && (
                  <Text className="text-xs text-gray-500">
                    SN: {item.serialNumber}
                  </Text>
                )}
                {!!item.locationId && (
                  <Text className="text-xs text-gray-500">
                    Location: {item.locationId}
                  </Text>
                )}
                {!!item.note && (
                  <Text className="text-xs text-gray-400 mt-1">
                    {item.note}
                  </Text>
                )}
              </View>
            );
          })}
        </VStack>
      )}
    </ScrollView>
  );
};

export default AssetItemsScreen;
