import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
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
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { assetService } from "@/services/asset";
import { AssetType, imageAssetSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ChevronDownIcon, TrashIcon } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import * as z from "zod";
import { Image } from "../ui/image";

const assetTypes = Object.values(AssetType);

const assetSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(Object.values(AssetType)),
  vendor: z.string().optional(),
  model: z.string().optional(),
  purchaseUrl: z.httpUrl({ error: "Please enter a valid URL" }).optional(),
  description: z.string().optional(),
  images: z.array(imageAssetSchema).optional(),
});

export type AssetValues = z.infer<typeof assetSchema>;

export type AssetFormProps = {
  assetId?: string;
};

const getDefaultValues = (assetData?: any): AssetValues => ({
  code: assetData?.code || "",
  name: assetData?.name || "",
  type: assetData?.type || AssetType.Device,
  vendor: assetData?.vendor || "",
  model: assetData?.model || "",
  purchaseUrl: assetData?.purchaseUrl || "",
  description: assetData?.description || "",
  images: assetData?.images || [],
});

export const AssetForm = ({ assetId }: AssetFormProps) => {
  const isEdit = !!assetId;
  const toast = useToast();

  const { data: assetData, isLoading: isLoadingData } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: () => assetService.getById(assetId!),
    enabled: isEdit,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: getDefaultValues(isEdit ? assetData : undefined),
    values: isEdit ? getDefaultValues(assetData) : undefined,
    mode: "onBlur",
  });

  const imageField = useFieldArray({
    control,
    name: "images",
  });

  const createMutation = useMutation({
    mutationFn: (payload: AssetValues) => {
      return assetService.create(payload);
    },
    onSuccess: () => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Asset created successfully!</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      router.back();
    },
    onError: (error) => {
      console.log("errors", JSON.stringify(error));
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: "bottom",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>
                  {error?.message || "Something went wrong."}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: AssetValues) => {
      const { images, ...data } = payload;
      return assetService.update(assetId!, data);
    },
    onSuccess: () => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Asset updated successfully!</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      router.back();
    },
    onError: (error: any) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>
                  {error?.message || "Something went wrong."}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = useCallback(
    (data: AssetValues) => {
      if (isEdit) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    },
    [isEdit, createMutation, updateMutation],
  );

  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      imageField.append(
        result.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type === "image" ? "image" : "video",
          duration: asset.duration,
        })),
      );
    }
  };

  useEffect(() => {
    console.log("errors form", errors);
  }, [errors]);

  if (isLoadingData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ButtonSpinner />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
    >
      <VStack space="md">
        <FormControl isRequired isInvalid={!!errors.code}>
          <FormControlLabel>
            <FormControlLabelText>Code</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. AST-001"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="code"
          />
          <FormControlError>
            <FormControlErrorText>{errors.code?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.name}>
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. MacBook Pro M1"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="name"
          />
          <FormControlError>
            <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Type</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select option" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {assetTypes.map((v) => (
                      <SelectItem key={v} label={v} value={v} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
            name="type"
          />
          <FormControlError>
            <FormControlErrorText>{errors.type?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Vendor</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. Apple"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="vendor"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Model</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. M1 2020"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="model"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.purchaseUrl}>
          <FormControlLabel>
            <FormControlLabelText>Purchase URL</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="https://..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="purchaseUrl"
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.purchaseUrl?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Description..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
            name="description"
          />
        </FormControl>

        <FormControl>
          <View className="mt-2">
            <FormControlLabelText>Images</FormControlLabelText>
            <Controller
              name="images"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Button onPress={onPickImage} variant="outline">
                    <ButtonText>Picker image</ButtonText>
                  </Button>
                  <View className="mt-4 flex-row flex-wrap items-start gap-4">
                    {value?.map((img, index) => (
                      <View key={img.uri} className="relative">
                        <View className="absolute top-0 right-0 z-10">
                          <Button
                            onPress={() => {
                              imageField.remove(index);
                            }}
                            variant="solid"
                          >
                            <ButtonIcon as={TrashIcon} />
                          </Button>
                        </View>
                        <Image
                          source={{
                            uri: img.uri,
                          }}
                          alt="Logo"
                          size="none"
                          className="w-full max-w-[100px] aspect-square rounded"
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            />
          </View>
        </FormControl>

        <Button
          onPress={handleSubmit(onSubmit)}
          isDisabled={loading}
          className="mt-4"
        >
          {loading && <ButtonSpinner />}
          <ButtonText>{isEdit ? "Update Asset" : "Create Asset"}</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};
