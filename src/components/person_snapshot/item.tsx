"use client";

import { PersonSnapshot } from "@/types/personSnapshots";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import styles from "./item.module.css";

export interface PersonSnapshotItemProps {
  personSnapshot: PersonSnapshot;
  onPersonIdClickAction: (personId: string) => void;
}

export default function PersonSnapshotItem({
  personSnapshot,
  onPersonIdClickAction,
}: PersonSnapshotItemProps) {
  const isJunk = personSnapshot.isJunk;

  const imageUrl = useMemo(() => {
    if (!personSnapshot.imageBlob) return null;
    return URL.createObjectURL(personSnapshot.imageBlob);
  }, [personSnapshot.imageBlob]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className={isJunk ? styles.errorCard : styles.defaultCard}>
      <div className={isJunk ? styles.errorImageContainer : styles.defaultImageContainer}>
        <div className={isJunk ? styles.errorImageBackground : styles.defaultImageBackground}>
          { isJunk && <div className={styles.errorImageLabel}>JUNK</div>}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Person Snapshot Image"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
          {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
        </div>
      </div>
      <div className={styles.cardMetaDataContainer}>
        <p className={styles.cardMainMetaDataText}>Person ID: {personSnapshot.personId}</p>
        <p className={styles.cardMetaDataText}>Camera ID: {personSnapshot.cameraId}</p>
        <p className={styles.cardMetaDataText}>View ID: {personSnapshot.viewId}</p>
        <p className={styles.cardMetaDataText}>Timestamp: {personSnapshot.timestamp.toLocaleString()}</p>
      </div>
    </div>
  );
}
