"use client";

import { PersonSnapshotSearchRequest } from "@/lib/api/v1/personSnapshotSearch";
import { useState } from "react";

interface PersonSnapshotSearchFormProps {
  onSearch: (request: PersonSnapshotSearchRequest) => void;
}

export default function PersonSnapshotSearchForm({ onSearch }: PersonSnapshotSearchFormProps) {
  const [personId, setPersonId] = useState<string>("");
  const [cameraId, setCameraId] = useState<string>("");
  const [viewId, setViewId] = useState<string>("");
  const [afterTimestamp, setAfterTimestamp] = useState<string>("");
  const [beforeTimestamp, setBeforeTimestamp] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: PersonSnapshotSearchRequest = {
      filters: {
        ids: null,
        image_ids: null,
        camera_ids: cameraId !== "" ? [parseInt(cameraId)] : null,
        view_ids: viewId !== "" ? [parseInt(viewId)] : null,
        person_ids: personId !== "" ? [personId] : null,
        after_timestamp: afterTimestamp !== ""? new Date(afterTimestamp).toISOString() : null,
        before_timestamp: beforeTimestamp !== "" ? new Date(beforeTimestamp).toISOString() : null,
      },
      ordering:{
        timestamp_asc: sortOrder === "asc" ? true : null,
        timestamp_desc: sortOrder === "desc" ? true : null,
      }
    };

    onSearch(request);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex w-full max-w-5xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid md:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="personId" className="text-sm font-semibold text-slate-700">
          Person ID
        </label>
        <input
          id="personId"
          type="text"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          placeholder="例: person_123"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cameraId" className="text-sm font-semibold text-slate-700">
          Camera ID
        </label>
        <input
          id="cameraId"
          type="number"
          value={cameraId}
          onChange={(e) => setCameraId(e.target.value)}
          placeholder="例: 1"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="viewId" className="text-sm font-semibold text-slate-700">
          View ID
        </label>
        <input
          id="viewId"
          type="number"
          value={viewId}
          onChange={(e) => setViewId(e.target.value)}
          placeholder="例: 1"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="afterTimestamp" className="text-sm font-semibold text-slate-700">
          開始日時
        </label>
        <input
          id="afterTimestamp"
          type="datetime-local"
          value={afterTimestamp}
          onChange={(e) => setAfterTimestamp(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="beforeTimestamp" className="text-sm font-semibold text-slate-700">
          終了日時
        </label>
        <input
          id="beforeTimestamp"
          type="datetime-local"
          value={beforeTimestamp}
          onChange={(e) => setBeforeTimestamp(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sortOrder" className="text-sm font-semibold text-slate-700">
          ソート順 (日時)
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="desc">新しい順 (降順)</option>
          <option value="asc">古い順 (昇順)</option>
        </select>
      </div>

      <div className="flex items-end md:col-span-3">
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0.5 active:shadow-sm">
          検索条件を適用
        </button>
      </div>
    </form>
  );
}
