import { Button, ButtonIcon } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { AssetItemModel, AssetItemStatus, AssetModel } from "@/types";
import { getFileUrl } from "@/utils/file";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Package,
  Trash2,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  items: AssetItemModel[];
  onRemoveItem: (itemId: string) => void;
  isRemoving?: boolean;
};

type AssetGroup = {
  assetKey: string;
  asset: AssetModel | null;
  items: AssetItemModel[];
};

const STATUS_STYLE: Record<string, { box: string; text: string }> = {
  [AssetItemStatus.Active]: {
    box: "bg-success-50 border-success-200",
    text: "text-success-700",
  },
  [AssetItemStatus.Faulty]: {
    box: "bg-error-50 border-error-200",
    text: "text-error-700",
  },
  [AssetItemStatus.Maintenance]: {
    box: "bg-warning-50 border-warning-200",
    text: "text-warning-700",
  },
  [AssetItemStatus.Retired]: {
    box: "bg-background-100 border-outline-200",
    text: "text-typography-500",
  },
};

/** Group flat asset-items by their (populated) asset. */
const groupByAsset = (items: AssetItemModel[]): AssetGroup[] => {
  const map = new Map<string, AssetGroup>();

  for (const item of items) {
    const asset =
      item.assetId && typeof item.assetId === "object" ? item.assetId : null;
    const key =
      asset?._id ??
      (typeof item.assetId === "string" ? item.assetId : "unknown");

    if (!map.has(key)) {
      map.set(key, { assetKey: key, asset, items: [] });
    }
    map.get(key)!.items.push(item);
  }

  return Array.from(map.values());
};

const StatusBadge = ({ status }: { status: AssetItemStatus }) => {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE[AssetItemStatus.Retired];
  return (
    <View className={`px-2 py-0.5 rounded border ${style.box}`}>
      <Text className={`text-[10px] font-bold ${style.text}`}>{status}</Text>
    </View>
  );
};

export const TicketAssetTree = ({ items, onRemoveItem, isRemoving }: Props) => {
  const groups = useMemo(() => groupByAsset(items), [items]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View className="rounded bg-background-0 overflow-hidden border border-outline-100">
      {groups.map((group, index) => {
        const isCollapsed = collapsed[group.assetKey];
        const asset = group.asset;
        const assetName = asset?.name ?? "Unknown asset";
        const thumb = asset?.imageUrls?.[0]
          ? getFileUrl(asset.imageUrls[0])
          : null;

        return (
          <View
            key={group.assetKey}
            className={cn(index === 0 ? "" : "border-t border-outline-100")}
          >
            {/* Asset node (parent) */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggle(group.assetKey)}
              className="flex-row items-center gap-3 p-3"
            >
              {isCollapsed ? (
                <ChevronRight size={18} className="text-typography-500" />
              ) : (
                <ChevronDown size={18} className="text-typography-500" />
              )}

              {/* Asset thumbnail / icon */}
              {thumb ? (
                <Image
                  source={{ uri: thumb }}
                  className="w-10 h-10 rounded-lg border border-outline-100"
                  resizeMode="cover"
                  alt={assetName}
                />
              ) : (
                <View className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 items-center justify-center">
                  <Box size={18} className="text-primary-600" />
                </View>
              )}

              <View className="flex-1">
                <Text
                  className="font-bold text-typography-900 text-sm"
                  numberOfLines={1}
                >
                  {assetName}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  {asset?.code && (
                    <Text className="text-[11px] text-typography-500 font-mono">
                      {asset.code}
                    </Text>
                  )}
                  {asset?.type && (
                    <View className="py-0.5 rounded bg-background-200 px-2">
                      <Text className="text-[10px] font-medium text-typography-600">
                        {asset.type}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="px-2 py-0.5 rounded-full bg-primary-600">
                <Text className="text-[10px] font-bold text-typography-0">
                  {group.items.length}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Item nodes (children) */}
            {!isCollapsed && (
              <View className="px-3 pb-2 pt-1">
                {group.items.map((item, idx) => {
                  const isLast = idx === group.items.length - 1;
                  return (
                    <View key={item._id} className="flex-row">
                      {/* Tree connector */}
                      <View className="w-5 items-center">
                        <View
                          className={`w-[1px] bg-outline-200 ${
                            isLast ? "h-5" : "flex-1"
                          }`}
                        />
                        <View className="w-3 h-[1px] bg-outline-200 absolute top-5 left-[10px]" />
                      </View>

                      <View className="flex-1 flex-row items-center justify-between py-2 pl-1 border-b border-outline-50">
                        <View className="flex-row items-center gap-2 flex-1 pr-2">
                          <Package size={14} className="text-typography-400" />
                          <View className="flex-1">
                            <Text
                              className="text-xs font-semibold text-typography-800"
                              numberOfLines={1}
                            >
                              {item.code ?? item._id.slice(-6).toUpperCase()}
                            </Text>
                            {item.serialNumber && (
                              <Text className="text-[10px] text-typography-500 mt-0.5">
                                SN: {item.serialNumber}
                              </Text>
                            )}
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <StatusBadge status={item.status} />
                          <Button
                            size="xs"
                            variant="outline"
                            action="negative"
                            onPress={() => onRemoveItem(item._id)}
                            isDisabled={isRemoving}
                            className="w-8 h-8 p-0 items-center justify-center"
                          >
                            <ButtonIcon as={Trash2} />
                          </Button>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
