import { departmentApis } from "@/apis/department";
import { userApis } from "@/apis/user";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { CreateUserDto, UpdateUserDto, UserRole, UserStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Option, SelectField, TextField, useFormToast } from "./fields";

type FormValues = {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  deptId: string;
  status: string;
};

const ROLE_OPTIONS: Option[] = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "User", value: "user" },
];

const STATUS_OPTIONS: Option[] = [
  { label: "Active", value: "active" },
  { label: "Blocked", value: "blocked" },
];

const USER_QUERY_KEY = ["manage", "user"];
const NONE = "__none__"; // sentinel for "no department"

export const UserForm = ({ userId }: { userId?: string }) => {
  const isEdit = !!userId;
  const showToast = useFormToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApis.getById(userId!),
    enabled: isEdit,
  });

  const { data: departments } = useQuery({
    queryKey: ["manage", "department"],
    queryFn: () => departmentApis.getList(),
  });

  const deptOptions: Option[] = [
    { label: "— None —", value: NONE },
    ...(departments ?? []).map((d) => ({ label: d.name, value: d._id })),
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      password: "",
      name: user?.name ?? "",
      role: user?.role ?? "user",
      deptId: user?.deptId ?? NONE,
      status: user?.status ?? "active",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: (v: FormValues) => {
      const deptId = v.deptId === NONE ? undefined : v.deptId;
      if (isEdit) {
        const payload: UpdateUserDto = {
          email: v.email.trim(),
          name: v.name.trim(),
          role: v.role as UserRole,
          deptId,
          status: v.status as UserStatus,
        };
        if (v.password.trim()) payload.password = v.password;
        return userApis.update(userId!, payload);
      }
      const payload: CreateUserDto = {
        username: v.username.trim(),
        email: v.email.trim(),
        password: v.password,
        name: v.name.trim(),
        role: v.role as UserRole,
        deptId,
        status: v.status as UserStatus,
      };
      return userApis.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      showToast("success", isEdit ? "User updated" : "User created");
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
          name="username"
          rules={
            isEdit ? {} : { required: "Username is required" }
          }
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Username"
              isRequired={!isEdit}
              isDisabled={isEdit}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. john.doe"
              autoCapitalize="none"
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Full name"
              isRequired
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. John Doe"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Email"
              isRequired
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            validate: (v) => {
              if (!isEdit && !v.trim()) return "Password is required";
              if (v && v.length < 6) return "At least 6 characters";
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={isEdit ? "New password (optional)" : "Password"}
              isRequired={!isEdit}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={isEdit ? "Leave blank to keep current" : "Min 6 characters"}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <SelectField
              label="Role"
              isRequired
              value={value}
              onValueChange={onChange}
              options={ROLE_OPTIONS}
            />
          )}
        />

        <Controller
          control={control}
          name="deptId"
          render={({ field: { onChange, value } }) => (
            <SelectField
              label="Department"
              value={value}
              onValueChange={onChange}
              options={deptOptions}
              placeholder="Select department"
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <SelectField
              label="Status"
              value={value}
              onValueChange={onChange}
              options={STATUS_OPTIONS}
            />
          )}
        />

        <Button
          className="mt-2"
          onPress={handleSubmit((v) => mutation.mutate(v))}
          isDisabled={mutation.isPending}
        >
          {mutation.isPending ? <ButtonSpinner /> : null}
          <ButtonText>{isEdit ? "Save changes" : "Create user"}</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};
