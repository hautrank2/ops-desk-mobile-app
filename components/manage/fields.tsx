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
import { ChevronDownIcon } from "lucide-react-native";
import React, { useCallback } from "react";
import type { KeyboardTypeOptions } from "react-native";

// ─── Toast helper ─────────────────────────────────────────────────────────────

export const useFormToast = () => {
  const toast = useToast();
  return useCallback(
    (action: "success" | "error", title: string, description?: string) => {
      const toastId = Math.random().toString();
      toast.show({
        id: toastId,
        placement: action === "success" ? "top" : "bottom",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action={action} variant="solid">
            <VStack space="xs">
              <ToastTitle>{title}</ToastTitle>
              {description ? (
                <ToastDescription>{description}</ToastDescription>
              ) : null}
            </VStack>
          </Toast>
        ),
      });
    },
    [toast],
  );
};

// ─── Text field ───────────────────────────────────────────────────────────────

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export const TextField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  isRequired,
  isDisabled,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
}: TextFieldProps) => (
  <FormControl isRequired={isRequired} isInvalid={!!error} isDisabled={isDisabled}>
    <FormControlLabel>
      <FormControlLabelText>{label}</FormControlLabelText>
    </FormControlLabel>
    <Input variant="outline" size="md">
      <InputField
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
    </Input>
    {error ? (
      <FormControlError>
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    ) : null}
  </FormControl>
);

// ─── Select field ─────────────────────────────────────────────────────────────

export type Option = { label: string; value: string };

type SelectFieldProps = {
  label: string;
  value?: string;
  onValueChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
};

export const SelectField = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select option",
  error,
  isRequired,
}: SelectFieldProps) => {
  const selectedLabel = options.find((o) => o.value === value)?.label;
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Select selectedValue={value} onValueChange={onValueChange}>
        <SelectTrigger variant="outline" size="md" className="justify-between">
          <SelectInput placeholder={placeholder} value={selectedLabel} />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map((o) => (
              <SelectItem key={o.value} label={o.label} value={o.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
      {error ? (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      ) : null}
    </FormControl>
  );
};
