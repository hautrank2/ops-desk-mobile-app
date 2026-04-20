export * from "./AppProvider";
export * from "./ProtocolProvider";

import { AppProvider } from "./AppProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { closeSnackbar } from "notistack";
import z from "zod";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useEffect } from "react";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { ProtocolProvider } from "./ProtocolProvider";
import i18next from "~/i18n";
import { DataTransferProvider } from "~/components/data-transfer";
import { AppThemeProvider } from "~/theme";
import { CameraPlayerPopup, CameraProvider } from "~/components/camera";

export function AllProviders({ children }: { children: React.ReactNode }) {
  //#region Tanstack  React Query Config
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
      },
    },
  });
  //#endregion

  const { i18n } = useTranslation();
  useEffect(() => {
    const zodLang = i18n.language === "vi" ? z.locales.vi : z.locales.en;
    if (zodLang) {
      z.config(zodLang());
    }
  }, [i18n.language]);

  return (
    <AppProvider>
      <ProtocolProvider>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              autoHideDuration={2000}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              action={(id) => (
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => closeSnackbar(id)}
                >
                  <CloseOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            >
              <AppThemeProvider>
                <I18nextProvider i18n={i18next}>
                  <DataTransferProvider>
                    <CameraProvider>
                      <CameraPlayerPopup />
                      {children}
                    </CameraProvider>
                  </DataTransferProvider>
                </I18nextProvider>
              </AppThemeProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ProtocolProvider>
    </AppProvider>
  );
}
