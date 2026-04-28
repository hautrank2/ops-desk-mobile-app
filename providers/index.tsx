import { AuthContextProvider } from "@/store/auth";
import { PaperProvider } from "react-native-paper";
import { AppProvider } from "./AppProvider";

export * from "./AppProvider";

export function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <PaperProvider>
      <AppProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </AppProvider>
    </PaperProvider>
  );
}
