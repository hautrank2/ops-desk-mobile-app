import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AssetForm } from '@/components/asset/AssetForm';
import { httpClient } from '@/lib/httpClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetModel } from '@/types';

const AddAssetScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<AssetModel>) => {
      return httpClient.post('/asset', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', 'asset'] });
      router.back();
    },
    onError: (error) => {
      console.error('Failed to create asset:', error);
      // Can show toast here
    }
  });

  return (
    <View className="flex-1 bg-white">
      <AssetForm
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </View>
  );
};

export default AddAssetScreen;
