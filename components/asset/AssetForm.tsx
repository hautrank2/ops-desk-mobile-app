import React from 'react';
import { View, Switch, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { AssetModel, AssetType } from '@/types';

type AssetFormProps = {
  initialData?: Partial<AssetModel>;
  onSubmit: (data: Partial<AssetModel>) => void;
  isLoading?: boolean;
};

export const AssetForm = ({ initialData, onSubmit, isLoading }: AssetFormProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      type: initialData?.type || AssetType.Device,
      vendor: initialData?.vendor || '',
      model: initialData?.model || '',
      description: initialData?.description || '',
      active: initialData?.active ?? true,
    }
  });

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <VStack space="md">
        <FormControl isInvalid={!!errors.code}>
          <FormControlLabel>
            <FormControlLabelText>Code</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            rules={{ required: 'Code is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. AST-001" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
            name="code"
          />
          {errors.code && <FormControlError><FormControlErrorText>{errors.code.message as string}</FormControlErrorText></FormControlError>}
        </FormControl>

        <FormControl isInvalid={!!errors.name}>
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. MacBook Pro M1" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
            name="name"
          />
          {errors.name && <FormControlError><FormControlErrorText>{errors.name.message as string}</FormControlErrorText></FormControlError>}
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Type (Device, Appliance, Furniture, IT, Facility)</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. Device" onBlur={onBlur} onChangeText={onChange} value={value as string} />
              </Input>
            )}
            name="type"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Vendor</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. Apple" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
            name="vendor"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Model</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="e.g. M1 2020" onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
            name="model"
          />
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField placeholder="Description..." onBlur={onBlur} onChangeText={onChange} value={value} />
              </Input>
            )}
            name="description"
          />
        </FormControl>

        <FormControl>
          <View className="flex-row items-center justify-between mt-2">
            <FormControlLabelText>Active Status</FormControlLabelText>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  onValueChange={onChange}
                  value={value}
                />
              )}
              name="active"
            />
          </View>
        </FormControl>

        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading} className="mt-4">
          <ButtonText>{isLoading ? 'Saving...' : 'Save Asset'}</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};