import { Button, ButtonIcon } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  ChevronDown,
  Search as SearchIcon,
  X as XIcon,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View,
} from "react-native";
import { useEntitySelect } from "./hook";
import { EntitySelectProps, SelectOption } from "./type";

export type { EntitySelectProps };

const DefaultOption = ({ option }: { option: SelectOption }) => (
  <View className="flex-1">
    <Text className="text-typography-900 font-medium">{option.name}</Text>
    {!!option.code && (
      <Text className="text-typography-500 text-xs mt-0.5">
        {option.code}
      </Text>
    )}
  </View>
);

export const EntitySelect = (props: EntitySelectProps) => {
  const {
    placeholder = "Select...",
    isDisabled,
    isInvalid,
    isClearable,
    renderOption,
    renderTrigger,
  } = props;

  const {
    isOpen,
    open,
    close,
    searchText,
    setSearchText,
    items,
    isLoading,
    isFetchingNextPage,
    onEndReached,
    selectedOption,
    isResolvingPreset,
    selectOption,
    clear,
  } = useEntitySelect(props);

  return (
    <View>
      <Pressable
        disabled={isDisabled}
        onPress={open}
        className={`min-h-10 flex-row items-center border rounded px-3 bg-background-0 ${
          isInvalid ? "border-error-700" : "border-background-300"
        } ${isDisabled ? "opacity-40" : ""}`}
      >
        <View className="flex-1">
          {renderTrigger ? (
            renderTrigger(selectedOption)
          ) : (
            <Text
              className={
                selectedOption
                  ? "text-typography-900"
                  : "text-typography-500"
              }
              numberOfLines={1}
            >
              {selectedOption
                ? selectedOption.code
                  ? `${selectedOption.name} (${selectedOption.code})`
                  : selectedOption.name
                : placeholder}
            </Text>
          )}
        </View>

        {isResolvingPreset && (
          <ActivityIndicator size="small" className="ml-2" />
        )}

        {isClearable && !!selectedOption && !isResolvingPreset && (
          <Pressable onPress={clear} hitSlop={8} className="ml-2">
            <Icon as={XIcon} className="text-background-500" size="sm" />
          </Pressable>
        )}

        <Icon as={ChevronDown} className="text-background-500 ml-2" size="sm" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <Pressable
          className="flex-1 bg-background-950/40"
          onPress={close}
        />
        <View className="bg-background-0 rounded-t-2xl max-h-[75%] px-4 pt-3 pb-6">
          <View className="w-10 h-1 rounded-full bg-background-300 self-center mb-3" />

          <Input className="mb-3">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} className="text-background-500" />
            </InputSlot>
            <InputField
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </Input>

          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = item.value === selectedOption?.value;
              return (
                <Pressable
                  onPress={() => selectOption(item)}
                  className={`flex-row items-center py-3 px-2 rounded ${
                    isSelected ? "bg-primary-50" : ""
                  }`}
                >
                  {renderOption ? renderOption(item) : <DefaultOption option={item} />}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              isLoading ? (
                <View className="py-8 items-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-typography-500 text-sm">
                    No results found.
                  </Text>
                </View>
              )
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-3 items-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : null
            }
          />

          <Button variant="outline" onPress={close} className="mt-2">
            <ButtonIcon as={XIcon} className="mr-2" />
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
};
