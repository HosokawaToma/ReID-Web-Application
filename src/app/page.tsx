"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useApiContext } from "./context/ApiContext";

export default function Home() {
  const { token, api } = useApiContext();
  useEffect(() => {
    if (token) {
      api.authRefreshAdminClient.refresh();
    }
  }, [token, api]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">ログイン</h1>
        <LoginForm api={api} />
      </div>
    </main>
  );
}
