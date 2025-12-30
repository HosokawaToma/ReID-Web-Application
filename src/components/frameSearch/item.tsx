import { Frame } from "@/types/frames";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import styles from "../styles/index.module.css";

export interface FrameSearchItemProps {
  frame: Frame;
  onFrameClickAction: ((frame: Frame) => void) | null;
}

export default function FrameSearchItem({ frame, onFrameClickAction }: FrameSearchItemProps) {
  const imageUrl = useMemo(() => {
    if (!frame.imageBlob) return null;
    return URL.createObjectURL(frame.imageBlob);
  }, [frame.imageBlob]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className={styles.defaultCard} onClick={() => onFrameClickAction?.(frame)}>
      <div className={styles.defaultImageContainer} onClick={() => onFrameClickAction?.(frame)}>
        <div className={styles.defaultImageBackground} onClick={() => onFrameClickAction?.(frame)}>
          {imageUrl && <Image src={imageUrl} alt="Frame" fill style={{ objectFit: "contain" }} />}
          {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
        </div>
      </div>
      <div className={styles.cardMetaDataContainer}>
        <p className={styles.cardMainMetaDataText}>Frame ID: {frame.id}</p>
        <p className={styles.cardMetaDataText}>Camera ID: {frame.cameraId}</p>
        <p className={styles.cardMetaDataText}>View ID: {frame.viewId}</p>
        <p className={styles.cardMetaDataText}>Timestamp: {frame.timestamp.toLocaleString()}</p>
      </div>
    </div>
  );
}
