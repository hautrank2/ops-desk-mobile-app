import { assetApi } from "@/api/asset";
import { AssetForm } from "@/components/asset/AssetForm";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Images } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const EditAssetScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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
      {/* Nút navigate sang trang quản lý ảnh */}
      <View className="px-4 pt-4">
        <Button
          variant="outline"
          onPress={() =>
            router.push({
              pathname: "/private/asset/images",
              params: { id },
            })
          }
          className="mb-2"
        >
          <ButtonIcon as={Images} className="mr-2" />
          <ButtonText>Manage Images</ButtonText>
        </Button>
      </View>

      <AssetForm assetId={id} />
    </View>
  );
};

export default EditAssetScreen;
