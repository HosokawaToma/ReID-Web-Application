"use client";

import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/index.module.css";
export interface PersonSnapshotItemProps {
  personSnapshot: PersonSnapshotMetaData;
  searchPersonSnapshotImage: (personSnapshotId: string) => Promise<Blob | null>;
  onClickAction: (personSnapshotId: string) => void;
  isSelected?: boolean;
}

export default function PersonSnapshotItem({
  personSnapshot,
  searchPersonSnapshotImage,
  onClickAction,
  isSelected = false,
}: PersonSnapshotItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const isJunk = personSnapshot.isJunk;

  useEffect(() => {
    searchPersonSnapshotImage(personSnapshot.id)
      .then((imageBlob) => {
        if (!imageBlob) return;
        setImageUrl(URL.createObjectURL(imageBlob));
      })
      .catch((error) => {
        console.error("Failed to load image:", error);
        // エラーが発生した場合は何も表示しない（Loading...が表示される）
      });
  }, [searchPersonSnapshotImage, personSnapshot.id]);

  const handleClick = () => {
    onClickAction(personSnapshot.id);
  };

  return (
    <div
      className={isJunk ? styles.errorCard : styles.defaultCard}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        backgroundColor: isSelected ? "#ffeb3b" : undefined,
        borderColor: isSelected ? "#fbc02d" : undefined,
        borderWidth: isSelected ? "2px" : undefined,
      }}
    >
      <div className={isJunk ? styles.errorImageContainer : styles.defaultImageContainer}>
        <div className={isJunk ? styles.errorImageBackground : styles.defaultImageBackground}>
          {isJunk && <div className={styles.errorImageLabel}>JUNK</div>}
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
        <p className={styles.cardMetaDataText}>
          Timestamp: {personSnapshot.timestamp.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
