import React, { useState } from "react";
import { Alert, ScrollView, View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import { Controller } from "react-hook-form";
import { ChevronDownIcon, Square, CheckSquare, Trash2, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { router } from "expo-router";

import { useTicketForm } from "./hook";
import { TicketFormProps, ticketTypes, ticketPriorities, ticketStatuses } from "./type";

export const TicketForm = (props: TicketFormProps) => {
  const {
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
    handleSubmit,
  } = useTicketForm(props);

  if (isEdit && isLoadingTicket) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ButtonSpinner />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background-0" contentContainerStyle={{ padding: 16 }}>
      <VStack space="md">
        {/* Ticket Code */}
        <FormControl isRequired isInvalid={!!errors.code}>
          <FormControlLabel><FormControlLabelText>Ticket Code</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input isDisabled={isEdit}>
                <InputField placeholder="e.g. TKT-001" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.code?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Title */}
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormControlLabel><FormControlLabelText>Title</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. AC leaking in room 102" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.title?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Type */}
        <FormControl isRequired isInvalid={!!errors.type}>
          <FormControlLabel><FormControlLabelText>Type</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger variant="outline" size="md" className="justify-between">
                  <SelectInput placeholder="Select type" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    {ticketTypes.map((v) => <SelectItem key={v} label={v} value={v} />)}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.type?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Priority */}
        <FormControl isRequired isInvalid={!!errors.priority}>
          <FormControlLabel><FormControlLabelText>Priority</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger variant="outline" size="md" className="justify-between">
                  <SelectInput placeholder="Select priority" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    {ticketPriorities.map((v) => <SelectItem key={v} label={v} value={v} />)}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.priority?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Status */}
        <FormControl isRequired isInvalid={!!errors.status}>
          <FormControlLabel><FormControlLabelText>Status</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger variant="outline" size="md" className="justify-between">
                  <SelectInput placeholder="Select status" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    {ticketStatuses.map((v) => <SelectItem key={v} label={v} value={v} />)}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.status?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Location */}
        <FormControl isInvalid={!!errors.locationId}>
          <FormControlLabel><FormControlLabelText>Location</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="locationId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger variant="outline" size="md" className="justify-between">
                  <SelectInput placeholder="Select Location" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    <SelectItem label="None" value="" />
                    {locations.map((loc) => (
                      <SelectItem key={loc._id} label={`${loc.name} ${loc.floor ? `(Floor ${loc.floor})` : ""}`} value={loc._id} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.locationId?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Assignee */}
        <FormControl isInvalid={!!errors.assigneeId}>
          <FormControlLabel><FormControlLabelText>Assignee</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="assigneeId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger variant="outline" size="md" className="justify-between">
                  <SelectInput placeholder="Select Assignee" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    <SelectItem label="Unassigned" value="" />
                    {users.map((u) => (
                      <SelectItem key={u._id} label={u.name || u.username} value={u._id} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError><FormControlErrorText>{errors.assigneeId?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Due Date */}
        <FormControl isInvalid={!!errors.dueAt}>
          <FormControlLabel><FormControlLabelText>Due Date</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="dueAt"
            render={({ field: { onChange, value } }) => {
              const [showPicker, setShowPicker] = useState(false);
              const currentDate = value ? new Date(value) : new Date();

              const handleConfirm = (date: Date) => {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                onChange(`${yyyy}-${mm}-${dd}`);
              };

              return (
                <View>
                  <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Input isReadOnly={true}>
                      <InputField
                        placeholder="Select due date (YYYY-MM-DD)"
                        value={value || ""}
                        editable={false}
                      />
                    </Input>
                  </TouchableOpacity>

                  {Platform.OS === 'ios' ? (
                    <Modal
                      visible={showPicker}
                      transparent={true}
                      animationType="slide"
                    >
                      <View className="flex-1 justify-end bg-black/40">
                        <View className="bg-background-0 p-4 rounded-t-2xl pb-8">
                          <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-typography-800 font-bold">Select Date</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                              <Text className="text-primary-600 font-bold">Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={currentDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                handleConfirm(selectedDate);
                              }
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                  ) : (
                    showPicker && (
                      <DateTimePicker
                        value={currentDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowPicker(false);
                          if (event.type === "set" && selectedDate) {
                            handleConfirm(selectedDate);
                          }
                        }}
                      />
                    )
                  )}
                </View>
              );
            }}
          />
          <FormControlError><FormControlErrorText>{errors.dueAt?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Asset Items Upgraded Selection */}
        <FormControl isRequired isInvalid={!!errors.assetItemIds}>
          <FormControlLabel><FormControlLabelText>Select Asset Items</FormControlLabelText></FormControlLabel>
          
          {/* Search bar inside selection container */}
          <View className="mb-2">
            <Input size="sm">
              <InputField
                placeholder="Search asset items..."
                value={assetSearchQuery}
                onChangeText={setAssetSearchQuery}
              />
            </Input>
          </View>

          <View className="border border-outline-200 rounded-lg p-3 max-h-56 bg-background-50">
            {(() => {
              const filtered = assetItems.filter((item) => {
                if (!assetSearchQuery) return true;
                const query = assetSearchQuery.toLowerCase();
                const assetName =
                  typeof item.asset === "object" ? item.asset.name : "Asset";
                const code = item._id.slice(-6).toUpperCase();
                const sn = item.serialNumber || "";
                return (
                  assetName.toLowerCase().includes(query) ||
                  code.toLowerCase().includes(query) ||
                  sn.toLowerCase().includes(query)
                );
              });

              if (filtered.length === 0) {
                return (
                  <Text className="text-typography-400 text-xs text-center py-4">
                    No matching asset items
                  </Text>
                );
              }

              return (
                <ScrollView nestedScrollEnabled className="space-y-3">
                  {filtered.map((item) => {
                    const assetName =
                      typeof item.asset === "object"
                        ? item.asset.name
                        : "Asset";
                    const codeLabel = item._id.slice(-6).toUpperCase();
                    const labelText = `${assetName} (${codeLabel}) ${item.serialNumber ? `· SN: ${item.serialNumber}` : ""}`;
                    const isChecked = selectedAssetItemIds.includes(item._id);

                    return (
                      <TouchableOpacity
                        key={item._id}
                        className="flex-row items-center py-1.5"
                        onPress={() => {
                          const next = isChecked
                            ? selectedAssetItemIds.filter((id) => id !== item._id)
                            : [...selectedAssetItemIds, item._id];
                          setValue("assetItemIds", next, { shouldValidate: true });
                        }}
                      >
                        <View className="mr-2.5">
                          {isChecked ? (
                            <CheckSquare size={18} className="text-primary-600" />
                          ) : (
                            <Square size={18} className="text-typography-400" />
                          )}
                        </View>
                        <Text className="text-sm text-typography-800 flex-1">
                          {labelText}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              );
            })()}
          </View>

          {/* Selected Chips list with close button */}
          {selectedAssetItemIds.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              {selectedAssetItemIds.map((id) => {
                const item = assetItems.find((a) => a._id === id);
                if (!item) return null;
                const assetName =
                  typeof item.asset === "object" ? item.asset.name : "Asset";
                const codeLabel = item._id.slice(-6).toUpperCase();

                return (
                  <View
                    key={id}
                    className="flex-row items-center bg-primary-50 border border-primary-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-xs font-semibold text-primary-600 mr-1.5">
                      {assetName} ({codeLabel})
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const next = selectedAssetItemIds.filter((x) => x !== id);
                        setValue("assetItemIds", next, { shouldValidate: true });
                      }}
                      className="p-0.5 rounded-full"
                    >
                      <X size={12} className="text-primary-600" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <FormControlError><FormControlErrorText>{errors.assetItemIds?.message}</FormControlErrorText></FormControlError>
        </FormControl>

        {/* Cause */}
        <FormControl>
          <FormControlLabel><FormControlLabelText>Root Cause</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="cause"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. Blown fuse" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
          />
        </FormControl>

        {/* Note */}
        <FormControl>
          <FormControlLabel><FormControlLabelText>Internal Note</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="Internal comments..." onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormControlLabel><FormControlLabelText>Description</FormControlLabelText></FormControlLabel>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="h-20">
                <InputField
                  multiline
                  placeholder="Detailed description of the issue..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlignVertical="top"
                />
              </Input>
            )}
          />
        </FormControl>

        {/* Images Selection - Create Mode Only */}
        {!isEdit && (
          <FormControl>
            <FormControlLabel><FormControlLabelText>Images (Max 2)</FormControlLabelText></FormControlLabel>
            <View className="flex-row items-center gap-3 mt-1 flex-wrap">
              {imageField.fields.map((field, idx) => (
                <View key={field.id} className="relative w-20 h-20 border border-outline-200 rounded-lg overflow-hidden bg-background-50">
                  <Image source={{ uri: field.uri }} alt="Preview" className="w-full h-full" resizeMode="cover" />
                  <TouchableOpacity
                    className="absolute top-1 right-1 bg-error-600 rounded-full p-1 w-6 h-6 items-center justify-center"
                    onPress={() => imageField.remove(idx)}
                  >
                    <Trash2 size={12} className="text-typography-0" />
                  </TouchableOpacity>
                </View>
              ))}

              {imageField.fields.length < 2 && (
                <TouchableOpacity
                  className="w-20 h-20 border border-dashed border-outline-300 rounded-lg items-center justify-center bg-background-50"
                  onPress={onPickImage}
                >
                  <Text className="text-typography-400 text-xs font-bold">+ Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </FormControl>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <Button variant="outline" className="flex-1" onPress={() => router.back()} isDisabled={loading}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button className="flex-1" onPress={handleSubmit} isDisabled={loading}>
            {loading && <ButtonSpinner className="mr-2" />}
            <ButtonText>{isEdit ? "Update Ticket" : "Save Ticket"}</ButtonText>
          </Button>
        </View>
      </VStack>
    </ScrollView>
  );
};
export default TicketForm;
