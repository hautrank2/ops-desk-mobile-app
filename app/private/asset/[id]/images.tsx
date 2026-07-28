/* eslint-disable react/no-unescaped-entities */
import { assetApis } from "@/apis/asset";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { getFileUrl } from "@/utils/file";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 2; // 2 cột, padding 16 mỗi bên + gap 16

const AssetImagesScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  // ─── Data ───────────────────────────────────────────────────────────────────

  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => assetApis.getById(id!),
    enabled: !!id,
  });

  const imageUrls: string[] = asset?.imageUrls ?? [];

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

  // ─── Add images mutation ─────────────────────────────────────────────────────

  const addMutation = useMutation({
    mutationFn: (
      images: {
        uri: string;
        fileName?: string | null;
        mimeType?: string | null;
      }[],
    ) => assetApis.addImages({ id: id!, images }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["asset", id], updated);
      queryClient.invalidateQueries({ queryKey: ["get", "asset"] });
      showToast("success", "Success", "Images added successfully.");
    },
    onError: (error: any) => {
      const msg =
        error?.message ?? "Failed to upload images. Please try again.";
      showToast("error", "Error", msg);
    },
  });

  // ─── Remove image mutation ───────────────────────────────────────────────────

  const removeMutation = useMutation({
    mutationFn: (imgIndex: number) => assetApis.removeImage(id!, imgIndex),
    onSuccess: (updated) => {
      queryClient.setQueryData(["asset", id], updated);
      queryClient.invalidateQueries({ queryKey: ["get", "asset"] });
      showToast("success", "Removed", "Image removed successfully.");
    },
    onError: (error: any) => {
      const msg = error?.message ?? "Failed to remove image.";
      showToast("error", "Error", msg);
    },
  });

  // ─── Pick image ──────────────────────────────────────────────────────────────

  const onPickImage = async () => {
    const remaining = 2 - imageUrls.length; // server tổng tối đa 2 ảnh/asset
    // Nếu server cho phép nhiều hơn thì bỏ giới hạn này
    if (remaining <= 0) {
      Alert.alert(
        "Limit reached",
        "This asset already has 2 images. Please remove one before adding.",
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const picked = result.assets.slice(0, remaining).map((a) => ({
      uri: a.uri,
      fileName: a.fileName,
      mimeType: a.mimeType,
    }));

    addMutation.mutate(picked);
  };

  // ─── Confirm delete ──────────────────────────────────────────────────────────

  const confirmRemove = (index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeMutation.mutate(index),
      },
    ]);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isMutating = addMutation.isPending || removeMutation.isPending;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-xl font-bold text-gray-800">Images</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {imageUrls.length}/2 uploaded
          </Text>
        </View>

        <Button
          onPress={onPickImage}
          isDisabled={isMutating || imageUrls.length >= 2}
          size="sm"
          variant="outline"
        >
          {addMutation.isPending ? (
            <ActivityIndicator size="small" className="mr-2" />
          ) : (
            <ButtonIcon as={Plus} className="mr-2" />
          )}
          <ButtonText>Add Image</ButtonText>
        </Button>
      </View>

      {/* Empty state */}
      {imageUrls.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-400 text-base text-center">
            No images yet.{"\n"}Tap "Add Image" to upload.
          </Text>
        </View>
      ) : (
        /* Image grid — 2 columns */
        <View className="flex-row flex-wrap gap-4">
          {imageUrls.map((url, index) => {
            const fullUrl = getFileUrl(url);
            const isRemoving =
              removeMutation.isPending && removeMutation.variables === index;

            return (
              <View
                key={`${url}-${index}`}
                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                className="rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  source={fullUrl}
                  resizeMode="cover"
                  alt={fullUrl}
                  className="w-full h-full"
                />

                {/* Overlay khi đang xoá */}
                {isRemoving && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center rounded-xl">
                    <ActivityIndicator color="#fff" />
                  </View>
                )}

                {/* Nút xoá */}
                {!isRemoving && (
                  <View className="absolute top-2 right-2">
                    <Button
                      size="xs"
                      action="negative"
                      variant="solid"
                      onPress={() => confirmRemove(index)}
                      isDisabled={isMutating}
                      className="rounded-full w-8 h-8 p-0 items-center justify-center"
                    >
                      <ButtonIcon as={Trash2} size="sm" />
                    </Button>
                  </View>
                )}

                {/* Index badge */}
                <View className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded-full">
                  <Text className="text-white text-xs font-medium">
                    #{index + 1}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Note */}
      <Text className="text-xs text-gray-400 text-center mt-8">
        Maximum 2 images per asset. Tap the red button to remove.
      </Text>
    </ScrollView>
  );
};

export default AssetImagesScreen;
