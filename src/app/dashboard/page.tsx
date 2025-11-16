"use client";

import IdentityPersonList from "@/components/identiry_person/list";

import { ApiV1GetPersonImages } from "@/lib/api/v1/getPersonImages";
import { ApiV1IdentifyPersonSearch } from "@/lib/api/v1/identifyPersonSearch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenContext } from "../context/TokenContext";
export default function Dashboard() {
  const { token } = useTokenContext();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">ダッシュボード</h1>
      <IdentityPersonList
        token={token}
        identifyPersonSearch={ApiV1IdentifyPersonSearch}
        getPersonImages={ApiV1GetPersonImages}
      />
    </main>
  );
}
