"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./item.module.css";

interface PersonSnapshotItemProps {
  token: string | null;
  personSnapshotImageSearch: (token: string | null, imageId: string) => Promise<Blob>;
  image_id: string;
  person_id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
  onPersonIdClick: (personId: string) => void;
}

export default function PersonSnapshotItem({
  token,
  personSnapshotImageSearch,
  image_id,
  person_id,
  camera_id,
  view_id,
  timestamp,
  onPersonIdClick,
}: PersonSnapshotItemProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  useEffect(() => {
    personSnapshotImageSearch(token, image_id).then((blob) => setImageBlob(blob));
  }, [token, image_id, personSnapshotImageSearch]);

  if (!imageBlob) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.itemCard}>
      <div className={styles.imageContainer}>
        <Image
          src={URL.createObjectURL(imageBlob)}
          alt={`Person ${person_id} (${image_id})`}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.personId}>
          Person ID:
          <button
            type="button"
            onClick={() => onPersonIdClick(person_id)}
            className={styles.personIdValue}>
            {person_id}
          </button>
        </p>
        <p className={styles.metaData}>
          Camera ID: <span className={styles.metaValue}>{camera_id}</span>
        </p>
        <p className={styles.metaData}>
          View ID: <span className={styles.metaValue}>{view_id}</span>
        </p>
        <p className={styles.timestamp}>Timestamp: {new Date(timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}
