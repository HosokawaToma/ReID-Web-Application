"use client";

import type {
  PersonSnapshotSearchRequest,
  PersonSnapshotSearchResponse,
} from "@/lib/api/v1/personSnapshotSearch";
import { useEffect, useState } from "react";
import PersonSnapshotItem from "./item";

interface PersonSnapshotListProps {
  token: string | null;
  request: PersonSnapshotSearchRequest | null;
  personSnapshotSearch: (
    token: string | null,
    request: PersonSnapshotSearchRequest | null
  ) => Promise<PersonSnapshotSearchResponse>;
  personSnapshotImageSearch: (token: string | null, imageId: string) => Promise<Blob>;
  onPersonIdClick: (personId: string) => void;
}

export default function PersonSnapshotList({
  token,
  request,
  personSnapshotSearch,
  personSnapshotImageSearch,
  onPersonIdClick,
}: PersonSnapshotListProps) {
  const [items, setItems] = useState<PersonSnapshotSearchResponse>({ person_snapshots: [] });
  useEffect(() => {
    personSnapshotSearch(token, request).then((items) => setItems(items));
  }, [token, personSnapshotSearch, request]);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
      {items.person_snapshots.map((item) => (
        <PersonSnapshotItem
          key={item.id}
          token={token}
          personSnapshotImageSearch={personSnapshotImageSearch}
          image_id={item.image_id}
          person_id={item.person_id}
          camera_id={item.camera_id}
          view_id={item.view_id}
          timestamp={item.timestamp}
          onPersonIdClick={onPersonIdClick}
        />
      ))}
    </div>
  );
}
