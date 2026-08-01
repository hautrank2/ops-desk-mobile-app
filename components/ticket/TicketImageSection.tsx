import { ticketApis } from "@/apis/ticket";
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
import { Plus, Trash2 } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 2;
const MAX_IMAGES = 2;

export const TicketImageSection = ({ ticketId }: { ticketId: string }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketApis.getById(ticketId),
    enabled: !!ticketId,
  });

  const imageUrls: string[] = ticket?.imageUrls ?? [];

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

  const addMutation = useMutation({
    mutationFn: (
      images: {
        uri: string;
        fileName?: string | null;
        mimeType?: string | null;
      }[],
    ) => ticketApis.addImages({ id: ticketId, images }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["ticket", ticketId], updated);
      queryClient.invalidateQueries({ queryKey: ["get", "ticket"] });
      showToast("success", "Success", "Images added successfully.");
    },
    onError: (error: any) => {
      const msg = error?.message || "Failed to upload images.";
      showToast("error", "Error", msg);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (imgIndex: number) => ticketApis.removeImage(ticketId, imgIndex),
    onSuccess: (updated) => {
      queryClient.setQueryData(["ticket", ticketId], updated);
      queryClient.invalidateQueries({ queryKey: ["get", "ticket"] });
      showToast("success", "Removed", "Image removed successfully.");
    },
    onError: (error: any) => {
      const msg = error?.message || "Failed to remove image.";
      showToast("error", "Error", msg);
    },
  });

  const onPickImage = async () => {
    const remaining = MAX_IMAGES - imageUrls.length;
    if (remaining <= 0) {
      Alert.alert(
        "Limit reached",
        `This ticket already has ${MAX_IMAGES} images. Please remove one before adding.`,
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required.",
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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isMutating = addMutation.isPending || removeMutation.isPending;

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-xl font-bold text-typography-800">Images</Text>
          <Text className="text-sm text-typography-500 mt-0.5">
            {imageUrls.length}/{MAX_IMAGES} uploaded
          </Text>
        </View>

        <Button
          onPress={onPickImage}
          isDisabled={isMutating || imageUrls.length >= MAX_IMAGES}
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

      {/* Empty State */}
      {imageUrls.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-typography-400 text-base text-center">
            No images yet.{"\n"}Tap "Add Image" to upload.
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {imageUrls.map((url, index) => {
            const fullUrl = getFileUrl(url);
            const isRemoving =
              removeMutation.isPending && removeMutation.variables === index;

            return (
              <View
                key={`${url}-${index}`}
                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                className="rounded-xl overflow-hidden bg-background-50 relative"
              >
                <Image
                  source={{ uri: fullUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {isRemoving && (
                  <View className="absolute inset-0 bg-background-800/50 items-center justify-center rounded-xl">
                    <ActivityIndicator color="#fff" />
                  </View>
                )}

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

                <View className="absolute bottom-2 left-2 bg-background-800/40 px-2 py-0.5 rounded-full">
                  <Text className="text-typography-0 text-xs font-medium">
                    #{index + 1}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <Text className="text-xs text-typography-400 text-center mt-8">
        Maximum {MAX_IMAGES} images per ticket. Tap the trash button to remove.
      </Text>
    </ScrollView>
  );
};
