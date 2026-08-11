import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon as GSIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

export type Badge = { text: string; tone: string };

type Props<T> = {
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  deleteFn: (id: string) => Promise<unknown>;
  getId: (item: T) => string;
  getPrimary: (item: T) => string;
  getSecondary: (item: T) => string;
  getBadge?: (item: T) => Badge | null;
  onAdd: () => void;
  onEdit: (id: string) => void;
  addLabel: string;
  emptyLabel: string;
  entityLabel: string; // used in the delete confirm dialog
};

export function EntityListScreen<T>({
  queryKey,
  queryFn,
  deleteFn,
  getId,
  getPrimary,
  getSecondary,
  getBadge,
  onAdd,
  onEdit,
  addLabel,
  emptyLabel,
  entityLabel,
}: Props<T>) {
  const queryClient = useQueryClient();
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      Alert.alert("Error", `Failed to delete ${entityLabel}.`);
    },
  });

  const confirmDelete = (id: string, name: string) => {
    Alert.alert("Confirm Delete", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-50">
      <View className="px-4 pt-4 pb-2">
        <Button size="sm" onPress={onAdd} className="self-end">
          <ButtonIcon as={Plus} className="mr-1" />
          <ButtonText>{addLabel}</ButtonText>
        </Button>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => getId(item)}
        contentContainerClassName="px-4 pb-8 gap-3"
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-typography-500">{emptyLabel}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const id = getId(item);
          const primary = getPrimary(item);
          const badge = getBadge?.(item);
          return (
            <View className="bg-background-0 rounded-2xl p-4 border border-outline-100 shadow-sm flex-row items-center gap-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-typography-900 font-semibold text-base"
                    numberOfLines={1}
                  >
                    {primary}
                  </Text>
                  {badge ? (
                    <View className={`px-2 py-0.5 rounded-full ${badge.tone}`}>
                      <Text className="text-[11px] font-semibold">
                        {badge.text}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  className="text-typography-500 text-xs mt-0.5"
                  numberOfLines={1}
                >
                  {getSecondary(item)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onEdit(id)}
                className="w-9 h-9 rounded-lg border border-outline-200 justify-center items-center"
              >
                <GSIcon as={Pencil} size="sm" className="text-typography-600" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDelete(id, primary)}
                className="w-9 h-9 rounded-lg border border-error-200 bg-error-50 justify-center items-center"
              >
                <GSIcon as={Trash2} size="sm" className="text-error-600" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
