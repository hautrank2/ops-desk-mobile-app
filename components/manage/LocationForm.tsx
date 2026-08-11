import { locationApis } from "@/apis/location";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { CreateLocationModel, FloorType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SelectField, TextField, useFormToast } from "./fields";

type FormValues = {
  code: string;
  name: string;
  floor: string;
  description: string;
  isActive: string; // "true" | "false"
};

const FLOOR_OPTIONS = [
  { label: "B2", value: "B2" },
  { label: "B1", value: "B1" },
  { label: "Ground (0)", value: "0" },
  { label: "Floor 1", value: "1" },
  { label: "Floor 2", value: "2" },
  { label: "Floor 3", value: "3" },
];

const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const toFloor = (v: string): FloorType | null => {
  if (!v) return null;
  if (v === "B1" || v === "B2") return v;
  return Number(v) as FloorType;
};

const LOCATION_QUERY_KEY = ["manage", "location"];

export const LocationForm = ({ locationId }: { locationId?: string }) => {
  const isEdit = !!locationId;
  const showToast = useFormToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => locationApis.getById(locationId!),
    enabled: isEdit,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: {
      code: data?.code ?? "",
      name: data?.name ?? "",
      floor: data?.floor != null ? String(data.floor) : "",
      description: data?.description ?? "",
      isActive: data ? String(data.isActive) : "true",
    },
    mode: "onBlur",
  });

  const buildPayload = (v: FormValues): CreateLocationModel => ({
    code: v.code.trim(),
    name: v.name.trim(),
    floor: toFloor(v.floor),
    description: v.description.trim() || undefined,
    isActive: v.isActive === "true",
  });

  const mutation = useMutation({
    mutationFn: (v: FormValues) =>
      isEdit
        ? locationApis.update(locationId!, buildPayload(v))
        : locationApis.create(buildPayload(v)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      showToast("success", isEdit ? "Location updated" : "Location created");
      router.back();
    },
    onError: () => {
      showToast("error", "Something went wrong", "Please try again.");
    },
  });

  return (
    <ScrollView
      className="flex-1 bg-background-50"
      contentContainerClassName="p-4"
      keyboardShouldPersistTaps="handled"
    >
      <VStack space="md">
        <Controller
          control={control}
          name="code"
          rules={{ required: "Code is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Code"
              isRequired
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. HN-F1-R01"
              autoCapitalize="characters"
              error={errors.code?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Name"
              isRequired
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. Meeting Room 01"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="floor"
          render={({ field: { onChange, value } }) => (
            <SelectField
              label="Floor"
              value={value}
              onValueChange={onChange}
              options={FLOOR_OPTIONS}
              placeholder="Select floor"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Optional"
            />
          )}
        />

        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <SelectField
              label="Status"
              value={value}
              onValueChange={onChange}
              options={ACTIVE_OPTIONS}
            />
          )}
        />

        <Button
          className="mt-2"
          onPress={handleSubmit((v) => mutation.mutate(v))}
          isDisabled={mutation.isPending}
        >
          {mutation.isPending ? <ButtonSpinner /> : null}
          <ButtonText>{isEdit ? "Save changes" : "Create location"}</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};
