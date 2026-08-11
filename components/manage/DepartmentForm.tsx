import { departmentApis } from "@/apis/department";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { CreateDepartmentDto } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SelectField, TextField, useFormToast } from "./fields";

type FormValues = {
  code: string;
  name: string;
  description: string;
  isActive: string; // "true" | "false"
};

const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const DEPARTMENT_QUERY_KEY = ["manage", "department"];

export const DepartmentForm = ({
  departmentId,
}: {
  departmentId?: string;
}) => {
  const isEdit = !!departmentId;
  const showToast = useFormToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: () => departmentApis.getById(departmentId!),
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
      description: data?.description ?? "",
      isActive: data ? String(data.isActive) : "true",
    },
    mode: "onBlur",
  });

  const buildPayload = (v: FormValues): CreateDepartmentDto => ({
    code: v.code.trim(),
    name: v.name.trim(),
    description: v.description.trim() || undefined,
    isActive: v.isActive === "true",
  });

  const mutation = useMutation({
    mutationFn: (v: FormValues) =>
      isEdit
        ? departmentApis.update(departmentId!, buildPayload(v))
        : departmentApis.create(buildPayload(v)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
      showToast("success", isEdit ? "Department updated" : "Department created");
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
              placeholder="e.g. IT"
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
              placeholder="e.g. Information Technology"
              error={errors.name?.message}
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
          <ButtonText>
            {isEdit ? "Save changes" : "Create department"}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};
