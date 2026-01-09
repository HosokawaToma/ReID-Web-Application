import { FrameMetaData } from "@/types/frames";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/index.module.css";

export interface FrameSearchItemProps {
  frameMetaData: FrameMetaData;
  searchFrameImage: (frameId: string) => Promise<Blob | null>;
  onFrameClickAction: ((frameId: string) => void) | null;
}

export default function FrameSearchItem({ frameMetaData, searchFrameImage, onFrameClickAction }: FrameSearchItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    searchFrameImage(frameMetaData.id).then((imageBlob) => {
      if (!imageBlob) return;
      setImageUrl(URL.createObjectURL(imageBlob));
    });
  }, [searchFrameImage, frameMetaData.id]);

  return (
    <div className={styles.defaultCard} onClick={() => onFrameClickAction?.(frameMetaData.id)}>
      <div className={styles.defaultImageContainer} onClick={() => onFrameClickAction?.(frameMetaData.id)}>
        <div className={styles.defaultImageBackground} onClick={() => onFrameClickAction?.(frameMetaData.id)}>
          {imageUrl && <Image src={imageUrl} alt="Frame" fill style={{ objectFit: "contain" }} />}
          {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
        </div>
      </div>
      <div className={styles.cardMetaDataContainer}>
        <p className={styles.cardMainMetaDataText}>Frame ID: {frameMetaData.id}</p>
        <p className={styles.cardMetaDataText}>Camera ID: {frameMetaData.cameraId}</p>
        <p className={styles.cardMetaDataText}>View ID: {frameMetaData.viewId}</p>
        <p className={styles.cardMetaDataText}>Timestamp: {frameMetaData.timestamp.toLocaleString()}</p>
      </div>
    </div>
  );
}
