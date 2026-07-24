import { ticketApis } from "@/apis/ticket";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { httpClient } from "@/lib/httpClient";
import {
  AssetItemModel,
  LocationModel,
  TableResponse,
  TicketPriority,
  TicketStatus,
  TicketType,
  UserModel,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Alert } from "react-native";
import {
  getDefaultValues,
  TicketFormProps,
  TicketFormValues,
  ticketSchema,
} from "./type";

export const useTicketForm = ({ ticketId }: TicketFormProps) => {
  const isEdit = !!ticketId;
  const toast = useToast();
  const queryClient = useQueryClient();
  const [assetSearchQuery, setAssetSearchQuery] = useState("");

  // Queries
  const { data: ticketData, isLoading: isLoadingTicket } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketApis.getById(ticketId!),
    enabled: isEdit,
  });

  const { data: locations = [] } = useQuery<LocationModel[]>({
    queryKey: ["get", "locations-all"],
    queryFn: async () => {
      const { data } = await httpClient.get<
        LocationModel[] | TableResponse<LocationModel>
      >("/location");
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  const { data: users = [] } = useQuery<UserModel[]>({
    queryKey: ["get", "users-all"],
    queryFn: async () => {
      const { data } = await httpClient.get<UserModel[]>("/user");
      return data || [];
    },
  });

  const { data: assetItems = [] } = useQuery<AssetItemModel[]>({
    queryKey: ["get", "asset-items-all"],
    queryFn: async () => {
      const { data } = await httpClient.get<
        TableResponse<AssetItemModel> | AssetItemModel[]
      >("/asset-item");
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: getDefaultValues(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (ticketData) {
      reset(getDefaultValues(ticketData));
    }
  }, [ticketData, reset]);

  const imageField = useFieldArray({
    control,
    name: "images",
  });

  const selectedAssetItemIds = watch("assetItemIds") || [];

  const showToast = useCallback(
    (action: "success" | "error", title: string, description: string) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: action === "success" ? "top" : "bottom",
        duration: 3000,
        render: ({ id: tid }) =>
          React.createElement(
            Toast,
            { nativeID: "toast-" + tid, action, variant: "solid" },
            React.createElement(
              VStack,
              { space: "xs" },
              React.createElement(ToastTitle, null, title),
              React.createElement(ToastDescription, null, description),
            ),
          ),
      });
    },
    [toast],
  );

  const createMutation = useMutation({
    mutationFn: (payload: TicketFormValues) =>
      ticketApis.create({
        code: payload.code,
        title: payload.title,
        type: payload.type as TicketType,
        priority: payload.priority as TicketPriority,
        status: payload.status as TicketStatus,
        assetItemIds: payload.assetItemIds,
        locationId: payload.locationId || undefined,
        assigneeId: payload.assigneeId || undefined,
        dueAt: payload.dueAt || undefined,
        cause: payload.cause || undefined,
        note: payload.note || undefined,
        description: payload.description || undefined,
        images: payload.images,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "ticket"] });
      showToast("success", "Success", "Ticket created successfully!");
      reset(getDefaultValues());
      router.back();
    },
    onError: (error: any) => {
      const msg = error?.message || "Something went wrong.";
      showToast("error", "Error", msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: TicketFormValues) =>
      ticketApis.update(ticketId!, {
        title: payload.title,
        type: payload.type as TicketType,
        priority: payload.priority as TicketPriority,
        status: payload.status as TicketStatus,
        assetItemIds: payload.assetItemIds,
        locationId: payload.locationId || undefined,
        assigneeId: payload.assigneeId || undefined,
        dueAt: payload.dueAt || undefined,
        cause: payload.cause || undefined,
        note: payload.note || undefined,
        description: payload.description || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "ticket"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      showToast("success", "Success", "Ticket updated successfully!");
      router.back();
    },
    onError: (error: any) => {
      const msg = error?.message || "Something went wrong.";
      showToast("error", "Error", msg);
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: TicketFormValues) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

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

  return {
    isEdit,
    isLoadingTicket,
    loading,
    control,
    errors,
    locations,
    users,
    assetItems,
    assetSearchQuery,
    setAssetSearchQuery,
    selectedAssetItemIds,
    setValue,
    imageField,
    onPickImage,
    handleSubmit: () => handleSubmit(onSubmit)(),
  };
};
