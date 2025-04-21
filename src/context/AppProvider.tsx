import { useState, ReactNode } from "react";
import { AppContext } from "./AppContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [messages, setMessages] = useState([]);

  return (
    <AppContext.Provider value={{ messages, setMessages }}>
      {children}
    </AppContext.Provider>
  );
};
