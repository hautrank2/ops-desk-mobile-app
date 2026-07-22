import { useColorScheme as useColorSchemaApp } from "react-native";

export const useColorScheme = () => {
  const colorSchema = useColorSchemaApp();
  return colorSchema;
};
