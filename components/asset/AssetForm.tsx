import { assetApi } from "@/api/asset";
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
import { AssetType, imageAssetSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ChevronDownIcon, TrashIcon } from "lucide-react-native";
import React, { useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import * as z from "zod";
import { Image } from "../ui/image";

const assetTypes = Object.values(AssetType);

// purchaseUrl: optional — nếu empty string thì bỏ qua, có giá trị thì validate URL
const assetSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(Object.values(AssetType) as [string, ...string[]]),
  vendor: z.string().optional(),
  model: z.string().optional(),
  purchaseUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL (https://...)",
    ),
  description: z.string().optional(),
  images: z.array(imageAssetSchema).optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;

export type AssetFormProps = {
  assetId?: string;
};

const getDefaultValues = (assetData?: any): AssetFormValues => ({
  code: assetData?.code ?? "",
  name: assetData?.name ?? "",
  type: assetData?.type ?? AssetType.Device,
  vendor: assetData?.vendor ?? "",
  model: assetData?.model ?? "",
  purchaseUrl: assetData?.purchaseUrl ?? "",
  description: assetData?.description ?? "",
  images: [],
});

export const AssetForm = ({ assetId }: AssetFormProps) => {
  const isEdit = !!assetId;
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: assetData, isLoading: isLoadingData } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: () => assetApi.getById(assetId!),
    enabled: isEdit,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: getDefaultValues(),
    values: isEdit && assetData ? getDefaultValues(assetData) : undefined,
    mode: "onBlur",
  });

  const imageField = useFieldArray({
    control,
    name: "images",
  });

  const showToast = useCallback(
    (action: "success" | "error", title: string, description: string) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: action === "success" ? "top" : "bottom",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action={action} variant="solid">
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

  const createMutation = useMutation({
    mutationFn: (payload: AssetFormValues) =>
      assetApi.create({
        code: payload.code,
        name: payload.name,
        type: payload.type as AssetType,
        vendor: payload.vendor || undefined,
        model: payload.model || undefined,
        purchaseUrl: payload.purchaseUrl || undefined,
        description: payload.description || undefined,
        images: payload.images,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "asset"] });
      showToast("success", "Success", "Asset created successfully!");
      reset(getDefaultValues());
      router.back();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      showToast("error", "Error", msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: AssetFormValues) =>
      assetApi.update(assetId!, {
        name: payload.name,
        type: payload.type as AssetType,
        vendor: payload.vendor || undefined,
        model: payload.model || undefined,
        purchaseUrl: payload.purchaseUrl || undefined,
        description: payload.description || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "asset"] });
      queryClient.invalidateQueries({ queryKey: ["asset", assetId] });
      showToast("success", "Success", "Asset updated successfully!");
      router.back();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      console.log("error", JSON.stringify(error));

      showToast("error", "Error", msg);
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = useCallback(
    (data: AssetFormValues) => {
      if (isEdit) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    },
    [isEdit, createMutation, updateMutation],
  );

  const onPickImage = async () => {
    const currentCount = imageField.fields.length;
    if (currentCount >= 2) {
      Alert.alert("Limit reached", "You can only upload up to 2 images.");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const remaining = 2 - currentCount;
      result.assets.slice(0, remaining).forEach((asset) => {
        imageField.append({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: "image",
          fileName: asset.fileName ?? undefined,
          fileSize: asset.fileSize ?? undefined,
          mimeType: asset.mimeType ?? undefined,
          duration: null,
          exif: null,
          base64: null,
          assetId: null,
        });
      });
    }
  };

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
        {/* Code */}
        <FormControl isRequired isInvalid={!!errors.code}>
          <FormControlLabel>
            <FormControlLabelText>Code</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input isDisabled={isEdit}>
                <InputField
                  placeholder="e.g. AST-001"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>{errors.code?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Name */}
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="name"
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
          />
          <FormControlError>
            <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Type */}
        <FormControl isRequired isInvalid={!!errors.type}>
          <FormControlLabel>
            <FormControlLabelText>Type</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="type"
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
          />
          <FormControlError>
            <FormControlErrorText>{errors.type?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Vendor */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Vendor</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="vendor"
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
          />
        </FormControl>

        {/* Model */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Model</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="model"
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
          />
        </FormControl>

        {/* Purchase URL */}
        <FormControl isInvalid={!!errors.purchaseUrl}>
          <FormControlLabel>
            <FormControlLabelText>Purchase URL</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="purchaseUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="https://..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.purchaseUrl?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Description..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                />
              </Input>
            )}
          />
        </FormControl>

        {/* Images (max 2) */}
        <FormControl>
          <View className="mt-2">
            <FormControlLabelText>
              Images ({imageField.fields.length}/2)
            </FormControlLabelText>
            <Controller
              name="images"
              control={control}
              render={({ field: { value } }) => (
                <View>
                  <Button
                    onPress={onPickImage}
                    variant="outline"
                    isDisabled={imageField.fields.length >= 2}
                    className="mt-2"
                  >
                    <ButtonText>Pick Image</ButtonText>
                  </Button>
                  <View className="mt-4 flex-row flex-wrap items-start gap-4">
                    {value?.map((img, index) => (
                      <View key={`${img.uri}-${index}`} className="relative">
                        <View className="absolute top-0 right-0 z-10">
                          <Button
                            onPress={() => imageField.remove(index)}
                            variant="solid"
                            size="xs"
                          >
                            <ButtonIcon as={TrashIcon} />
                          </Button>
                        </View>
                        <Image
                          source={{ uri: img.uri }}
                          alt={`Image ${index + 1}`}
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
