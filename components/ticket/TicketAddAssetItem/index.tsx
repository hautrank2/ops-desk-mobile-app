import { assetItemApis } from "@/apis/asset-item";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AssetItemModel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  CheckSquare,
  MinusSquare,
  Search,
  Square,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAssetOf, groupByAsset } from "../assetItemGroup";
import {
  TicketAddAssetItemDialogProps,
  TicketAddAssetItemProps,
  TicketAddAssetItemValues,
  ticketAddAssetItemSchema,
} from "./type";

/**
 * Form bên trong dialog — chỉ gồm nội dung: tiêu đề, tìm kiếm, checklist,
 * và 2 nút Cancel / Add Selected. Không bao gồm phần trigger hay danh sách
 * đã chọn (những phần đó thuộc về form Ticket).
 */
export const TicketAddAssetItem = ({
  isEdit,
  defaultValues,
  onSubmit,
  onCancel,
  excludedAssetItemId,
}: TicketAddAssetItemProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TicketAddAssetItemValues>({
    resolver: zodResolver(ticketAddAssetItemSchema),
    defaultValues: defaultValues ?? { assetItemIds: [] },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const selected = watch("assetItemIds") || [];

  const { data: assetItems = [] } = useQuery<AssetItemModel[]>({
    queryKey: ["get", "asset-items-all", "populate-asset"],
    queryFn: async () => {
      const res = await assetItemApis.getList({ populations: ["assetId"] });
      return res.items || [];
    },
  });

  const filteredItems = useMemo(() => {
    const excluded = new Set(excludedAssetItemId);
    const base = assetItems.filter((item) => !excluded.has(item._id));
    if (!searchQuery) return base;
    const q = searchQuery.toLowerCase();
    return base.filter((item) => {
      const asset = getAssetOf(item);
      const code = item._id.slice(-6).toLowerCase();
      const sn = (item.serialNumber || "").toLowerCase();
      return (
        (asset?.name || "Asset").toLowerCase().includes(q) ||
        (asset?.code || "").toLowerCase().includes(q) ||
        code.includes(q) ||
        sn.includes(q)
      );
    });
  }, [assetItems, searchQuery, excludedAssetItemId]);

  // Tree structure: assets (parent) → asset items (children).
  const groups = useMemo(() => groupByAsset(filteredItems), [filteredItems]);
  const filteredIds = useMemo(
    () => filteredItems.map((i) => i._id),
    [filteredItems],
  );

  const setIds = (ids: string[]) =>
    setValue("assetItemIds", ids, { shouldValidate: true });

  const toggle = (id: string) =>
    setIds(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  // Toggle every child of one asset at once.
  const toggleGroup = (groupIds: string[]) => {
    const allIn = groupIds.every((id) => selected.includes(id));
    setIds(
      allIn
        ? selected.filter((id) => !groupIds.includes(id))
        : Array.from(new Set([...selected, ...groupIds])),
    );
  };

  // Select-all across every currently visible asset item.
  const toggleAll = () => {
    const allIn =
      filteredIds.length > 0 &&
      filteredIds.every((id) => selected.includes(id));
    setIds(
      allIn
        ? selected.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...selected, ...filteredIds])),
    );
  };

  const allChecked =
    filteredIds.length > 0 && filteredIds.every((id) => selected.includes(id));
  const someChecked =
    !allChecked && filteredIds.some((id) => selected.includes(id));

  const submit = handleSubmit((values) => {
    const items: AssetItemModel[] = [];
    const indexes: number[] = [];
    values.assetItemIds.forEach((id) => {
      const idx = assetItems.findIndex((a) => a._id === id);
      if (idx >= 0) {
        items.push(assetItems[idx]);
        indexes.push(idx);
      }
    });
    onSubmit(values.assetItemIds, items, indexes);
  });

  return (
    <View className="flex-1">
      {/* Title */}
      <View className="flex-row justify-between items-center pb-4 border-b border-outline-100">
        <Text className="text-lg font-bold text-typography-900">
          {isEdit ? "Update Asset Items" : "Select Asset Items"}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <X size={20} className="text-typography-600" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="my-3 flex-row items-center bg-background-50 border border-outline-200 rounded-lg px-3 py-2">
        <Search size={16} className="text-typography-400 mr-2" />
        <Input className="flex-1 border-0 h-8">
          <InputField
            placeholder="Search asset items..."
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

      {/* Content: tree — assets (parent) → items (children) */}
      <Controller
        control={control}
        name="assetItemIds"
        render={() => (
          <View className="flex-1">
            {filteredItems.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-typography-400 text-sm">
                  No matching asset items
                </Text>
              </View>
            ) : (
              <ScrollView className="flex-1">
                {/* Select all */}
                <TouchableOpacity
                  onPress={toggleAll}
                  className="flex-row items-center px-3 py-2.5 border-b border-outline-200 bg-background-50"
                >
                  <View className="mr-3">
                    {allChecked ? (
                      <CheckSquare size={20} className="text-primary-600" />
                    ) : someChecked ? (
                      <MinusSquare size={20} className="text-primary-600" />
                    ) : (
                      <Square size={20} className="text-typography-400" />
                    )}
                  </View>
                  <Text className="font-bold text-typography-900 text-sm">
                    Select all ({filteredIds.length})
                  </Text>
                </TouchableOpacity>

                {groups.map((group) => {
                  const groupIds = group.items.map((i) => i._id);
                  const groupAll = groupIds.every((id) =>
                    selected.includes(id),
                  );
                  const groupSome =
                    !groupAll && groupIds.some((id) => selected.includes(id));

                  return (
                    <View key={group.assetId}>
                      {/* Parent: asset with per-asset select-all */}
                      <TouchableOpacity
                        onPress={() => toggleGroup(groupIds)}
                        className="flex-row items-center px-3 py-2.5 bg-background-100 border-b border-outline-100"
                      >
                        <View className="mr-3">
                          {groupAll ? (
                            <CheckSquare
                              size={20}
                              className="text-primary-600"
                            />
                          ) : groupSome ? (
                            <MinusSquare
                              size={20}
                              className="text-primary-600"
                            />
                          ) : (
                            <Square size={20} className="text-typography-400" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-typography-900 text-sm">
                            {group.asset?.name ?? "Asset"}
                          </Text>
                          <Text className="text-xs text-typography-500 mt-0.5">
                            {group.asset?.code ?? ""}
                            {group.asset?.type ? ` · ${group.asset.type}` : ""}
                            {` · ${groupIds.length} item(s)`}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Children: asset items */}
                      {group.items.map((item) => {
                        const isChecked = selected.includes(item._id);
                        return (
                          <TouchableOpacity
                            key={item._id}
                            onPress={() => toggle(item._id)}
                            className={`flex-row items-center pl-10 pr-3 py-2.5 border-b border-outline-50 ${
                              isChecked ? "bg-primary-50/40" : ""
                            }`}
                          >
                            <View className="mr-3">
                              {isChecked ? (
                                <CheckSquare
                                  size={18}
                                  className="text-primary-600"
                                />
                              ) : (
                                <Square
                                  size={18}
                                  className="text-typography-400"
                                />
                              )}
                            </View>
                            <View className="flex-1">
                              <Text className="text-sm text-typography-900">
                                {item.code}
                              </Text>
                              <Text className="text-xs text-typography-900">
                                {item.serialNumber
                                  ? `SN: ${item.serialNumber}`
                                  : ""}
                              </Text>
                              {item.note && (
                                <Text className="text-xs text-typography-900">
                                  {item.note}
                                </Text>
                              )}
                            </View>
                            <View className="px-2 py-0.5 rounded bg-success-50 border border-success-100">
                              <Text className="text-[10px] font-bold text-success-700">
                                {item.status}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}
      />

      <FormControl isInvalid={!!errors.assetItemIds}>
        <FormControlError>
          <FormControlErrorText>
            {errors.assetItemIds?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Actions: Cancel + Submit */}
      <View className="flex-row justify-between items-center pt-4 border-t border-outline-100 mt-2">
        <Text className="text-sm font-semibold text-typography-600">
          Selected: {selected.length}
        </Text>
        <View className="flex-row gap-3">
          <Button size="sm" variant="outline" onPress={onCancel}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button size="sm" onPress={submit}>
            <ButtonText>Add Selected</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
};

/**
 * Dialog bọc ngoài — <Dialog><TicketAddAssetItem/></Dialog>.
 * Chỉ mount form khi mở để `defaultValues` được khởi tạo lại mỗi lần mở.
 */
export const TicketAddAssetItemDialog = ({
  isOpen,
  onCancel,
  ...formProps
}: TicketAddAssetItemDialogProps) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background-0 rounded-t-2xl p-4 h-[80%] pb-8">
          {isOpen && <TicketAddAssetItem onCancel={onCancel} {...formProps} />}
        </View>
      </View>
    </Modal>
  );
};
