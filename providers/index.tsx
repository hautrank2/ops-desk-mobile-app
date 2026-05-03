import { AuthContextProvider } from "@/store/auth";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppProvider } from "./AppProvider";

export * from "./AppProvider";

const queryClient = new QueryClient()

export function AllProviders({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
