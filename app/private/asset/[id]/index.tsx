import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

const AssetDetailIndex = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return (
    <Redirect href={{ pathname: "/private/asset/[id]/items", params: { id } }} />
  );
};

export default AssetDetailIndex;
