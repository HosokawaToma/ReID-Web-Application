"use client";

import { useTokenContext } from "@/app/context/TokenContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Global({ children }: { children: React.ReactNode }) {
  const { token } = useTokenContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    if (pathname === "/") {
      router.push("/dashboard");
      return;
    }
  }, [token, router, pathname]);

  return (
    <>
      {children}
    </>
  );
}
