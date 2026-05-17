import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AssetForm } from '@/components/asset/AssetForm';

const AssetItemScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      <AssetForm assetId={id as string} />
    </View>
  );
};

export default AssetItemScreen;
