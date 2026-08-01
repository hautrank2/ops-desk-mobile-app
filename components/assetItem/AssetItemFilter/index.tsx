import { AssetSelectField, LocationSelectField } from "@/components/selects";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
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
import { AssetItemStatus } from "@/types";
import { ChevronDownIcon } from "lucide-react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { useAssetItemFilter } from "./hook";
import { AssetItemFilterProps } from "./type";

const statusOptions = Object.values(AssetItemStatus);

export const AssetItemFilter = (props: AssetItemFilterProps) => {
  const { control, applyFilter, resetFilter } = useAssetItemFilter(props);

  return (
    <VStack space="md" className="p-4 bg-background-0">
      {/* Code */}
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Code</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Search by code..."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            </Input>
          )}
        />
      </FormControl>

      {/* Serial Number */}
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Serial Number</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="serialNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Search by serial number..."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            </Input>
          )}
        />
      </FormControl>

      {/* Status */}
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Status</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Select selectedValue={value} onValueChange={onChange}>
              <SelectTrigger variant="outline" size="md" className="justify-between">
                <SelectInput placeholder="All statuses" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="All statuses" value="" />
                  {statusOptions.map((s) => (
                    <SelectItem key={s} label={s} value={s} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
      </FormControl>

      {/* Asset */}
      <Controller
        control={control}
        name="assetId"
        render={({ field: { onChange, value } }) => (
          <AssetSelectField
            label="Asset"
            isClearable
            placeholder="All assets"
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* Location */}
      <Controller
        control={control}
        name="locationId"
        render={({ field: { onChange, value } }) => (
          <LocationSelectField
            label="Location"
            isClearable
            placeholder="All locations"
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* Actions */}
      <View className="flex-row gap-3 mt-1">
        <Button variant="outline" className="flex-1" onPress={resetFilter}>
          <ButtonText>Reset</ButtonText>
        </Button>
        <Button className="flex-1" onPress={applyFilter}>
          <ButtonText>Apply</ButtonText>
        </Button>
      </View>
    </VStack>
  );
};
