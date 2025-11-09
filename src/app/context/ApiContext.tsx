"use client"

import { useApi } from "@/hooks/useApi";
import { ApiV1 } from "@/lib/api/v1";
import React, { createContext, useContext } from "react";

interface ApiContextType {
  token: string | null;
  api: ApiV1;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, api } = useApi();

  return <ApiContext.Provider value={{ token, api }}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
