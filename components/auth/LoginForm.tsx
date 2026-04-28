import { httpClient } from "@/lib/httpClient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from "react-native-paper";

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
  email: string;
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
  const raw = res.data;
  return raw;
};

export const LoginForm = ({
  defaultValues,
  afterSuccess,
  onCancel,
}: LoginFormProps) => {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValues>({
    mode: "onChange",
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const loginRes = await onLogin(values.email, values.password);

      await afterSuccess?.(loginRes, {
        email: values.email.trim(),
        password: values.password,
      });
    } catch (err: unknown) {
      let str = "";
      setSnackbar(str);
    }
  };

  return (
    <View className="flex flex-col gap-2 flex-1">
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar(null)}
        action={{
          label: "Close",
          onPress: () => {
            setSnackbar(null);
          },
        }}
      >
        {snackbar}
      </Snackbar>
      <View className="flex flex-col gap-2">
        <View>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Please enter your email",
              validate: (value) => {
                const trimmed = value.trim();

                if (!trimmed) {
                  return "Please enter your email";
                }

                if (trimmed.length < 3) {
                  return "email must be at least 3 characters";
                }

                if (trimmed.length > 50) {
                  return "email must be no longer than 50 characters";
                }

                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                disabled={isSubmitting}
                mode="outlined"
                label="Email"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <HelperText type="error">{errors.email?.message}</HelperText>
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
              <TextInput
                disabled={isSubmitting}
                mode="outlined"
                label="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <HelperText type="error">{errors.password?.message}</HelperText>
        </View>
      </View>

      {onCancel && (
        <Button
          mode="text"
          onPress={onCancel}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
        className="mt-2"
      >
        Login
      </Button>
    </View>
  );
};
