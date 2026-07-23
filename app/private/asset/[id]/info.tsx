import { assetApi } from "@/api/asset";
import { AssetForm } from "@/components/asset/AssetForm";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const EditAssetScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { isLoading } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => assetApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Asset not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AssetForm assetId={id} />
    </View>
  );
};

export default EditAssetScreen;
