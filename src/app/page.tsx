"use client";

import LoginForm from "@/components/auth/LoginForm";
import { ApiV1AuthLoginAdminClient } from "@/lib/api/v1/authLoginAdminClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenContext } from "./context/TokenContext";

export default function Home() {
  const { token, setToken } = useTokenContext();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">ログイン</h1>
        <LoginForm login={ApiV1AuthLoginAdminClient} setToken={setToken} />
      </div>
    </main>
  );
}
