"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface IdentityPersonItemProps {
  token: string | null;
  getPersonImages: (token: string | null, imageId: string) => Promise<Blob>;
  image_id: string;
  person_id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export default function IdentityPersonItem({
  token,
  getPersonImages,
  image_id,
  person_id,
  camera_id,
  view_id,
  timestamp,
}: IdentityPersonItemProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  useEffect(() => {
    getPersonImages(token, image_id).then((blob) => setImageBlob(blob));
  }, [token, image_id, getPersonImages]);

  if (!imageBlob) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg p-4 m-2">
      <Image
        src={URL.createObjectURL(imageBlob)}
        alt={`Person ${person_id} (${image_id})`}
        width={200}
        height={200}
        className="object-cover rounded-md"
      />
      <p>Person ID: {person_id}</p>
      <p>Camera ID: {camera_id}</p>
      <p>View ID: {view_id}</p>
      <p>Timestamp: {timestamp}</p>
    </div>
  );
}
