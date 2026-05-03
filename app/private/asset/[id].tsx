import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AssetForm } from '@/components/asset/AssetForm';
import { httpClient } from '@/lib/httpClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetModel } from '@/types';
import { Text } from '@/components/ui/text';

const EditAssetScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: asset, isLoading: isFetching } = useQuery({
    queryKey: ['get', 'asset', id],
    queryFn: async () => {
      const response = await httpClient.get(`/asset/${id}`);
      return response.data as AssetModel;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<AssetModel>) => {
      return httpClient.patch(`/asset/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', 'asset'] });
      queryClient.invalidateQueries({ queryKey: ['get', 'asset', id] });
      router.back();
    },
    onError: (error) => {
      console.error('Failed to update asset:', error);
    }
  });

  if (isFetching) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!asset) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Asset not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AssetForm
        initialData={asset}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </View>
  );
};

export default EditAssetScreen;
