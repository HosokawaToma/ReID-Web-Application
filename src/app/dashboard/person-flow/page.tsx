"use client";

import PersonFlowWeight from "@/components/PersonFlowWeight";

export default function PersonFlowPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8 md:p-24">
      <h1 className="mb-8 text-3xl font-bold text-slate-800 md:text-4xl">Person Flow Graph</h1>
      <PersonFlowWeight />
    </main>
  );
}
