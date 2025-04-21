import { createContext, useContext } from "react";

interface AppContextType {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

// Create Context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom Hook for Accessing Context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
