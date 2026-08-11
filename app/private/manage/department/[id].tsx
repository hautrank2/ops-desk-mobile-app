import { DepartmentForm } from "@/components/manage/DepartmentForm";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditDepartmentScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DepartmentForm departmentId={id} />;
};

export default EditDepartmentScreen;
