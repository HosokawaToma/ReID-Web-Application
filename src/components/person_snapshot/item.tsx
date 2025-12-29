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
    <div className={`${styles.itemContainer} ${isJunk ? styles.itemContainerJunk : ""}`}>
      <div className={`${styles.imageContainer} ${isJunk ? styles.imageContainerJunk : ""}`}>
        {isJunk && <div className={styles.junkBadge}>JUNK</div>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Person Snapshot Image"
            fill
            style={{ objectFit: "contain" }}
          />
        )}
        {!imageUrl && <div className={styles.loading}>Loading...</div>}
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.personId}>
          Person ID:
          {personSnapshot.personId && (
            <button
              type="button"
              onClick={() =>
                personSnapshot.personId && onPersonIdClickAction(personSnapshot.personId)
              }
              className={styles.personIdValue}>
              {personSnapshot.personId}
            </button>
          )}
          {!personSnapshot.personId && <span className={styles.personIdValue}>No person ID</span>}
        </p>
        <p className={styles.metaData}>
          Camera ID: <span className={styles.metaValue}>{personSnapshot.cameraId}</span>
        </p>
        <p className={styles.metaData}>
          View ID: <span className={styles.metaValue}>{personSnapshot.viewId}</span>
        </p>
        <p className={styles.timestamp}>Timestamp: {personSnapshot.timestamp.toLocaleString()}</p>
      </div>
    </div>
  );
}
