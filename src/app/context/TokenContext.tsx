"use client";

import { setTokenUpdateCallback } from "@/lib/api/fetchWithTokenRefresh";
import { createContext, useContext, useEffect, useState } from "react";

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // トークン更新コールバックを設定
    setTokenUpdateCallback((newToken: string) => {
      setToken(newToken);
    });

    // クリーンアップ
    return () => {
      setTokenUpdateCallback(null);
    };
  }, []);

  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>;
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within an TokenProvider");
  }
  return context;
};
