import React from 'react';
import { View } from 'react-native';
import { AssetForm } from '@/components/asset/AssetForm';

const CreateAssetScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <AssetForm />
    </View>
  );
};

export default CreateAssetScreen;
