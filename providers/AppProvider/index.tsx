export * from "./type";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { AppFont, AppTheme } from "./type";

// Navigation: AppProvider is outside RouterProvider, so use window.location for redirects

type Action =
  | { type: "SET_THEME"; payload: AppTheme }
  | { type: "SET_FONT"; payload: AppFont };

// Define state shape
type AppState = {};

// Initial state
const initialState: AppState = {};

// Reducer
const AppReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    default:
      return state;
  }
};

// Context type
export type AppContextType = {
  state: AppState;
  dispatch: Dispatch<Action>;
  actions: {
    fetchServices: () => void;
    onAuthorize: () => void;
    onLogout: () => void;
  };
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const fetchServices = useCallback(async () => {}, []);

  const onAuthorize = useCallback(async () => {}, []);

  const onLogout = useCallback(() => {}, []);

  useEffect(() => {}, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        actions: { fetchServices, onAuthorize, onLogout },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use App
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
