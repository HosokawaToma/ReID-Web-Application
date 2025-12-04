"use client";

import IdentityPersonList from "@/components/person_snapshot/list";
import PersonSnapshotSearchForm from "@/components/person_snapshot/search_form";

import { ApiV1PersonSnapshotImageSearch } from "@/lib/api/v1/personSnapshotImageSearch";
import {
  ApiV1PersonSnapshotSearch,
  PersonSnapshotSearchRequest,
} from "@/lib/api/v1/personSnapshotSearch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "../context/TokenContext";

export default function Dashboard() {
  const { token } = useTokenContext();
  const router = useRouter();
  const [request, setRequest] = useState<PersonSnapshotSearchRequest | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8 md:p-24">
      <h1 className="mb-8 text-3xl font-bold text-slate-800 md:text-4xl">ダッシュボード</h1>

      <PersonSnapshotSearchForm onSearch={setRequest} />

      <IdentityPersonList
        token={token}
        request={request}
        personSnapshotSearch={ApiV1PersonSnapshotSearch}
        personSnapshotImageSearch={ApiV1PersonSnapshotImageSearch}
      />
    </main>
  );
}
