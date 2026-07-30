import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Image } from "@/components/ui/image";
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
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
} from "@/components/ui/date-time-picker";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { CalendarDays, ChevronDownIcon, Trash2 } from "lucide-react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { TicketAddAssetItemDialog } from "@/components/ticket/TicketAddAssetItem";
import { TicketAssetItemTable } from "@/components/ticket/TicketAssetItemTable";
import { useTicketForm } from "./hook";
import {
  TicketFormProps,
  ticketPriorities,
  ticketStatuses,
  ticketTypes,
} from "./type";

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
    imageField,
    onPickImage,
    handleSubmit,
  } = useTicketForm(props);

  const [isAssetDialogOpen, setIsAssetDialogOpen] = React.useState(false);

  if (isEdit && isLoadingTicket) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ButtonSpinner />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      contentContainerStyle={{ padding: 16 }}
    >
      <VStack space="md">
        {/* Title */}
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormControlLabel>
            <FormControlLabelText>Title</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. AC leaking in room 102"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>{errors.title?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Type */}
        <FormControl isRequired isInvalid={!!errors.type}>
          <FormControlLabel>
            <FormControlLabelText>Type</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select type" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {ticketTypes.map((v) => (
                      <SelectItem key={v} label={v} value={v} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>{errors.type?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Priority */}
        <FormControl isRequired isInvalid={!!errors.priority}>
          <FormControlLabel>
            <FormControlLabelText>Priority</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select priority" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {ticketPriorities.map((v) => (
                      <SelectItem key={v} label={v} value={v} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.priority?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Status */}
        <FormControl isRequired isInvalid={!!errors.status}>
          <FormControlLabel>
            <FormControlLabelText>Status</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select status" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {ticketStatuses.map((v) => (
                      <SelectItem key={v} label={v} value={v} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.status?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Location */}
        <FormControl isInvalid={!!errors.locationId}>
          <FormControlLabel>
            <FormControlLabelText>Location</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="locationId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select Location" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="None" value="" />
                    {locations.map((loc) => (
                      <SelectItem
                        key={loc._id}
                        label={`${loc.name} ${loc.floor ? `(Floor ${loc.floor})` : ""}`}
                        value={loc._id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.locationId?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Assignee */}
        <FormControl isInvalid={!!errors.assigneeId}>
          <FormControlLabel>
            <FormControlLabelText>Assignee</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="assigneeId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
                <SelectTrigger
                  variant="outline"
                  size="md"
                  className="justify-between"
                >
                  <SelectInput placeholder="Select Assignee" onBlur={onBlur} />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Unassigned" value="" />
                    {users.map((u) => (
                      <SelectItem
                        key={u._id}
                        label={u.name || u.username}
                        value={u._id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.assigneeId?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Due Date */}
        <FormControl isInvalid={!!errors.dueAt}>
          <FormControlLabel>
            <FormControlLabelText>Due Date</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="dueAt"
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                mode="date"
                format="YYYY-MM-DD"
                placeholder="Select due date (YYYY-MM-DD)"
                value={value ? new Date(value) : undefined}
                onChange={(date) => {
                  if (!date) {
                    onChange("");
                    return;
                  }
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, "0");
                  const dd = String(date.getDate()).padStart(2, "0");
                  onChange(`${yyyy}-${mm}-${dd}`);
                }}
              >
                <DateTimePickerTrigger>
                  <DateTimePickerInput />
                  <DateTimePickerIcon as={CalendarDays} />
                </DateTimePickerTrigger>
              </DateTimePicker>
            )}
          />
          <FormControlError>
            <FormControlErrorText>{errors.dueAt?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Asset Items — trigger + danh sách đã chọn; chọn qua Dialog */}
        <Controller
          control={control}
          name="assetItemIds"
          render={({ field: { onChange, value } }) => {
            const selectedIds = value || [];
            const selectedItems = selectedIds
              .map((id) => assetItems.find((a) => a._id === id))
              .filter((v): v is (typeof assetItems)[number] => Boolean(v));
            return (
              <FormControl isRequired isInvalid={!!errors.assetItemIds}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Select Asset Items ({selectedItems.length})
                  </FormControlLabelText>
                </FormControlLabel>

                {/* Trigger mở Dialog */}
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => {
                    setIsAssetDialogOpen(true);
                  }}
                >
                  <ButtonText>Add Asset Items</ButtonText>
                </Button>

                {/* Danh sách đã chọn */}
                <TicketAssetItemTable
                  data={selectedItems}
                  onClickDelete={(item) =>
                    onChange(selectedIds.filter((x) => x !== item._id))
                  }
                  maxHeight={640}
                />

                <FormControlError>
                  <FormControlErrorText>
                    {errors.assetItemIds?.message}
                  </FormControlErrorText>
                </FormControlError>

                {/* Dialog chọn thêm asset item (ẩn item đã chọn) */}
                <TicketAddAssetItemDialog
                  isOpen={isAssetDialogOpen}
                  isEdit={isEdit}
                  defaultValues={{ assetItemIds: [] }}
                  excludedAssetItemId={selectedIds}
                  onCancel={() => setIsAssetDialogOpen(false)}
                  onSubmit={(ids) => {
                    onChange(Array.from(new Set([...selectedIds, ...ids])));
                    setIsAssetDialogOpen(false);
                  }}
                />
              </FormControl>
            );
          }}
        />

        {/* Cause */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Root Cause</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="cause"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="e.g. Blown fuse"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
        </FormControl>

        {/* Note */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Internal Note</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Internal comments..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
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
            <FormControlLabel>
              <FormControlLabelText>Images (Max 2)</FormControlLabelText>
            </FormControlLabel>
            <View className="flex-row items-center gap-3 mt-1 flex-wrap">
              {imageField.fields.map((field, idx) => (
                <View
                  key={field.id}
                  className="relative w-20 h-20 border border-outline-200 rounded-lg overflow-hidden bg-background-50"
                >
                  <Image
                    source={{ uri: field.uri }}
                    alt="Preview"
                    className="w-full h-full"
                    resizeMode="cover"
                  />
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
                  <Text className="text-typography-400 text-xs font-bold">
                    + Photo
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </FormControl>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => router.back()}
            isDisabled={loading}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            className="flex-1"
            onPress={handleSubmit}
            isDisabled={loading}
          >
            {loading && <ButtonSpinner className="mr-2" />}
            <ButtonText>{isEdit ? "Update Ticket" : "Save Ticket"}</ButtonText>
          </Button>
        </View>
      </VStack>
    </ScrollView>
  );
};
