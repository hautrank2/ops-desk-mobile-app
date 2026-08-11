import { UserForm } from "@/components/manage/UserForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditUserScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UserForm userId={id} />;
};

export default EditUserScreen;
