"use client"

import { ApiV1 } from "@/lib/api/v1";
import { useCallback, useState } from "react";

export const useApi = () => {
  const [token, setToken] = useState<string | null>(null);
  const getToken = useCallback(() => token, [token]);
  const [api] = useState<ApiV1>(ApiV1.create(setToken, getToken));

  return { token, api };
};
