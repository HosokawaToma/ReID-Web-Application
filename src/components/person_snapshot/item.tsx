"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PersonSnapshotItemProps {
  token: string | null;
  personSnapshotImageSearch: (token: string | null, imageId: string) => Promise<Blob>;
  image_id: string;
  person_id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export default function PersonSnapshotItem({
  token,
  personSnapshotImageSearch,
  image_id,
  person_id,
  camera_id,
  view_id,
  timestamp,
}: PersonSnapshotItemProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  useEffect(() => {
    personSnapshotImageSearch(token, image_id).then((blob) => setImageBlob(blob));
  }, [token, image_id, personSnapshotImageSearch]);

  if (!imageBlob) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-row rounded-2xl p-4 m-2"
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid #999",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        height: "240px",
      }}>
      <div style={{ width: "240px", height: "100%", position: "relative" }}>
        <Image
          src={URL.createObjectURL(imageBlob)}
          alt={`Person ${person_id} (${image_id})`}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div
        className="ml-4"
        style={{
          marginLeft: "40px",
          marginRight: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
        }}>
        <p className="text-lg font-bold text-slate-800">
          Person ID: <span className="font-mono text-blue-600">{person_id}</span>
        </p>
        <p className="text-sm font-medium text-slate-600">
          Camera ID: <span className="font-bold text-slate-800">{camera_id}</span>
        </p>
        <p className="text-sm font-medium text-slate-600">
          View ID: <span className="font-bold text-slate-800">{view_id}</span>
        </p>
        <p className="text-xs text-slate-400">Timestamp: {timestamp}</p>
      </div>
    </div>
  );
}
