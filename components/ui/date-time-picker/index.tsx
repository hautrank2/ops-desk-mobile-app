import { Icon } from "@/components/ui/icon";
import DateTimePickerNative from "@react-native-community/datetimepicker";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export type DateTimePickerMode = "date" | "time" | "datetime";

type DateTimePickerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode: DateTimePickerMode;
  placeholder?: string;
  format?: string;
  disabled?: boolean;
};

const DateTimePickerContext = createContext<DateTimePickerContextValue | null>(
  null,
);

const useDateTimePickerContext = () => {
  const ctx = useContext(DateTimePickerContext);
  if (!ctx) {
    throw new Error(
      "DateTimePicker.* components must be used within <DateTimePicker>",
    );
  }
  return ctx;
};

// Minimal token formatter (YYYY, MM, DD, HH, mm, ss).
const formatDate = (date: Date, format?: string): string => {
  if (!format) return date.toLocaleString();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return format
    .replace("YYYY", date.getFullYear().toString())
    .replace("MM", pad(date.getMonth() + 1))
    .replace("DD", pad(date.getDate()))
    .replace("HH", pad(date.getHours()))
    .replace("mm", pad(date.getMinutes()))
    .replace("ss", pad(date.getSeconds()));
};

export type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  children?: React.ReactNode;
};

export const DateTimePicker = ({
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  is24Hour,
  disabled,
  placeholder,
  format,
  children,
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (!disabled) setIsOpen(true);
  }, [disabled]);
  const close = useCallback(() => setIsOpen(false), []);

  const ctx = useMemo<DateTimePickerContextValue>(
    () => ({
      isOpen,
      open,
      close,
      value,
      onChange,
      mode,
      placeholder,
      format,
      disabled,
    }),
    [isOpen, open, close, value, onChange, mode, placeholder, format, disabled],
  );

  // Android has no native "datetime" mode; fall back to date-only picking.
  const nativeMode = mode === "datetime" ? "date" : mode;

  return (
    <DateTimePickerContext.Provider value={ctx}>
      {children}

      {isOpen &&
        (Platform.OS === "ios" ? (
          <IOSPicker
            value={value}
            mode={mode}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            is24Hour={is24Hour}
            onChange={onChange}
            onClose={close}
          />
        ) : (
          <DateTimePickerNative
            value={value ?? new Date()}
            mode={nativeMode}
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            is24Hour={is24Hour}
            onChange={(event, selected) => {
              close();
              if (event.type === "set" && selected) onChange?.(selected);
            }}
          />
        ))}
    </DateTimePickerContext.Provider>
  );
};

type IOSPickerProps = {
  value?: Date;
  mode: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  onChange?: (date: Date | undefined) => void;
  onClose: () => void;
};

// iOS shows a spinner inside a bottom-sheet modal with Cancel / Done.
const IOSPicker = ({
  value,
  mode,
  minimumDate,
  maximumDate,
  is24Hour,
  onChange,
  onClose,
}: IOSPickerProps) => {
  const [temp, setTemp] = useState(value ?? new Date());

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-background-950/50"
          onPress={onClose}
        />
        <View className="bg-background-0 rounded-t-2xl p-4 pb-8">
          <View className="flex-row justify-between items-center mb-2 border-b border-outline-100 pb-2">
            <Pressable onPress={onClose}>
              <Text className="text-typography-500 font-semibold">Cancel</Text>
            </Pressable>
            <Text className="text-typography-900 font-semibold">
              {mode === "time"
                ? "Select Time"
                : mode === "datetime"
                  ? "Select Date & Time"
                  : "Select Date"}
            </Text>
            <Pressable
              onPress={() => {
                onChange?.(temp);
                onClose();
              }}
            >
              <Text className="text-primary-600 font-semibold">Done</Text>
            </Pressable>
          </View>
          <DateTimePickerNative
            value={temp}
            mode={mode}
            display="spinner"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            is24Hour={is24Hour}
            onChange={(_event, selected) => {
              if (selected) setTemp(selected);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export type DateTimePickerTriggerProps = React.ComponentProps<
  typeof Pressable
> & {
  className?: string;
};

export const DateTimePickerTrigger = ({
  children,
  className,
  ...props
}: DateTimePickerTriggerProps) => {
  const { open, disabled } = useDateTimePickerContext();
  return (
    <Pressable
      onPress={open}
      disabled={disabled}
      className={`flex-row items-center justify-between h-10 px-3 rounded-md border border-outline-300 bg-background-0 ${
        disabled ? "opacity-40" : ""
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export type DateTimePickerInputProps = {
  className?: string;
  placeholder?: string;
};

export const DateTimePickerInput = ({
  className,
  placeholder,
}: DateTimePickerInputProps) => {
  const { value, placeholder: ctxPlaceholder, format } =
    useDateTimePickerContext();
  const display = value ? formatDate(value, format) : "";
  return (
    <TextInput
      className={`flex-1 py-0 text-base text-typography-900 placeholder:text-typography-400 ${
        className ?? ""
      }`}
      editable={false}
      pointerEvents="none"
      value={display}
      placeholder={placeholder ?? ctxPlaceholder}
    />
  );
};

export type DateTimePickerIconProps = React.ComponentProps<typeof Icon>;

export const DateTimePickerIcon = ({
  className,
  size = "sm",
  ...props
}: DateTimePickerIconProps) => (
  <Icon className={`text-typography-400 ${className ?? ""}`} size={size} {...props} />
);
