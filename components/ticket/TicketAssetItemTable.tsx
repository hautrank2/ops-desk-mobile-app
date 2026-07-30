import { Button, ButtonIcon } from "@/components/ui/button";
import { AssetItemModel } from "@/types";
import { X } from "lucide-react-native";
import React, { useMemo } from "react";
import { DimensionValue, ScrollView, Text, View } from "react-native";
import { groupByAsset } from "./assetItemGroup";

export type TicketAssetItemTableProps = {
  data: AssetItemModel[];
  onClickDelete: (item: AssetItemModel, index: number) => void;
  maxHeight?: DimensionValue | undefined;
};

export const TicketAssetItemTable = ({
  data,
  onClickDelete,
  maxHeight,
}: TicketAssetItemTableProps) => {
  const groups = useMemo(() => groupByAsset(data), [data]);

  // Map each item id to its index in the flat `data` (kept for onClickDelete).
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item, i) => map.set(item._id, i));
    return map;
  }, [data]);

  if (data.length === 0) return null;

  // Flatten the tree into ScrollView children so each asset header can stick.
  const rows: React.ReactNode[] = [];
  const stickyIndices: number[] = [];

  groups.forEach((group) => {
    stickyIndices.push(rows.length);
    rows.push(
      <View
        key={`asset-${group.assetId}`}
        className="flex-row items-center px-3 py-2 bg-background-100 border-b border-outline-200"
      >
        <View className="flex-1">
          <Text className="text-sm font-bold text-typography-900">
            {group.asset?.name ?? "Asset"}
          </Text>
          <Text className="text-xs text-typography-500 mt-0.5">
            {group.asset?.code ?? ""}
            {group.asset?.type ? ` · ${group.asset.type}` : ""}
            {` · ${group.items.length} item(s)`}
          </Text>
        </View>
      </View>,
    );

    group.items.forEach((item) => {
      const index = indexById.get(item._id) ?? -1;
      rows.push(
        <View
          key={item._id}
          className="flex-row items-center pl-6 pr-3 py-2.5 bg-background-0 border-b border-outline-50"
        >
          <View className="flex-1 pr-2">
            <Text className="text-sm text-typography-900">
              ID: {item._id.slice(-6).toUpperCase()}
              {item.serialNumber ? ` · SN: ${item.serialNumber}` : ""}
            </Text>
          </View>

          <View className="w-20 items-center">
            <View className="px-2 py-0.5 rounded bg-success-50 border border-success-100">
              <Text className="text-[10px] font-bold text-success-700">
                {item.status}
              </Text>
            </View>
          </View>

          <View className="w-12 items-end">
            <Button
              size="xs"
              variant="outline"
              action="negative"
              className="w-8 h-8 p-0 rounded-md"
              onPress={() => onClickDelete(item, index)}
            >
              <ButtonIcon as={X} size="sm" />
            </Button>
          </View>
        </View>,
      );
    });
  });

  return (
    // Outer wrapper clips rounded corners; scroll area is capped so the tree
    // never grows unbounded inside the parent form.
    <View className="mt-3 border border-outline-200 rounded-lg overflow-hidden">
      <ScrollView
        nestedScrollEnabled
        stickyHeaderIndices={stickyIndices}
        style={{ maxHeight }}
      >
        {rows}
      </ScrollView>
    </View>
  );
};
