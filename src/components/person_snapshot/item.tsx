"use client";

import { PersonSnapshot } from "@/types/personSnapshots";
import Image from "next/image";
import styles from "./item.module.css";

export interface PersonSnapshotItemProps {
  personSnapshot: PersonSnapshot;
  onPersonIdClickAction: (personId: string) => void;
}

export default function PersonSnapshotItem({ personSnapshot, onPersonIdClickAction }: PersonSnapshotItemProps) {
  return (
    <div className={styles.itemCard}>
      <div className={styles.imageContainer}>
        {personSnapshot.imageBlob && (
        <Image
          src={URL.createObjectURL(personSnapshot.imageBlob)}
          alt={`Person Snapshot Image`}
            layout="fill"
            objectFit="contain"
          />
        )}
        {!personSnapshot.imageBlob && (
          <div className={styles.loading}>Loading...</div>
        )}
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.personId}>
          Person ID:
          {personSnapshot.personId && (
            <button
              type="button"
              onClick={() => personSnapshot.personId && onPersonIdClickAction(personSnapshot.personId)}
              className={styles.personIdValue}>
              {personSnapshot.personId}
            </button>
          )}
          {!personSnapshot.personId && (
            <span className={styles.personIdValue}>No person ID</span>
          )}
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
