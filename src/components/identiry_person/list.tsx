"use client";

import type { IdentifyPersonSearchResponse } from "@/lib/api/v1/identifyPersonSearch";
import { useEffect, useState } from "react";
import IdentityPersonItem from "./item";

interface IdentityPersonListProps {
  token: string | null;
  identifyPersonSearch: (token: string | null) => Promise<IdentifyPersonSearchResponse[]>;
  getPersonImages: (token: string | null, imageId: string) => Promise<Blob>;
}

export default function IdentityPersonList({ token, identifyPersonSearch, getPersonImages}: IdentityPersonListProps) {
  const [items, setItems] = useState<IdentifyPersonSearchResponse[]>([]);
  useEffect(() => {
    identifyPersonSearch(token).then((items) => setItems(items));
  }, [token, identifyPersonSearch]);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {items.map((item) => (
        <IdentityPersonItem
          key={item.image_id}
          token={token}
          getPersonImages={getPersonImages}
          image_id={item.image_id}
          person_id={item.person_id}
          camera_id={item.camera_id}
          view_id={item.view_id}
          timestamp={item.timestamp}
        />
      ))}
    </div>
  );
}
