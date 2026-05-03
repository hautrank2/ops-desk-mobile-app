import { httpClient } from "@/lib/httpClient";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, ButtonText } from "../ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { Input, InputField } from "../ui/input";
import { Toast, ToastTitle, useToast } from "../ui/toast";

export type LoginFormProps = {
  defaultValues?: Partial<LoginValues>;
  afterSuccess?: (
    result: LoginResult,
    values: LoginValues,
  ) => void | Promise<void>;
  onCancel?: () => void;
};

export type LoginResult = {
  _id: string;
  username: string;
  role: string;
  token: string;
};

export type LoginValues = {
  username: string;
  password: string;
};

const onLogin = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  const res = await httpClient.post<LoginResult>("/auth/signin", {
    username,
    password,
  });
  return res.data;
};

export const LoginForm = ({
  defaultValues,
  afterSuccess,
  onCancel,
}: LoginFormProps) => {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValues>({
    mode: "onChange",
    defaultValues: {
      username: defaultValues?.username ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (values: { username: string; password: string }) =>
      onLogin(values.username, values.password),
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const loginRes = await mutation.mutateAsync(values);
      await afterSuccess?.(loginRes, {
        username: values.username.trim(),
        password: values.password,
      });
    } catch (err: unknown) {
      console.log(JSON.stringify(err));
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast
              nativeID={toastId}
              action="error"
              variant="outline"
              className="p-4 gap-3 w-full sm:min-w-[386px] max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
            >
              <ToastTitle>Username or password incorrect</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-col gap-2">
        <View>
          <Controller
            control={control}
            name="username"
            rules={{
              required: "Please enter your username",
              validate: (value) => {
                const trimmed = value.trim();

                if (!trimmed) {
                  return "Please enter your username";
                }

                if (trimmed.length < 3) {
                  return "Username must be at least 3 characters";
                }

                if (trimmed.length > 50) {
                  return "username must be no longer than 50 characters";
                }

                return true;
              },
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Username</FormControlLabelText>
                  </FormControlLabel>
                  <Input
                    isDisabled={mutation.isPending}
                    variant="outline"
                    size="md"
                  >
                    <InputField
                      value={value}
                      onChangeText={(v) => {
                        onChange(v);
                      }}
                      placeholder="Enter username here..."
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.username?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              );
            }}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Please enter your password",
              validate: (value) => {
                if (!value.trim()) {
                  return "Please enter your password";
                }

                if (value.length < 6) {
                  return "Password must be at least 6 characters";
                }

                if (value.length > 100) {
                  return "Password must be no longer than 100 characters";
                }

                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Input
                  isDisabled={mutation.isPending}
                  variant="outline"
                  size="md"
                >
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter password here..."
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon />
                  <FormControlErrorText>
                    {errors.password?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
        </View>
      </View>

      {onCancel && (
        <Button variant="outline" onPress={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      )}

      <Button
        variant="solid"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting || mutation.isPending}
        className="mt-2"
      >
        <ButtonText>Login</ButtonText>
      </Button>
    </View>
  );
};
