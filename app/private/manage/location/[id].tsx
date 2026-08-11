import { LocationForm } from "@/components/manage/LocationForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditLocationScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocationForm locationId={id} />;
};

export default EditLocationScreen;
