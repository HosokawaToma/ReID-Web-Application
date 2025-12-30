import { Frame } from "@/types/frames";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import styles from "../styles/index.module.css";


export default function FrameSearchScreen({ frame }: { frame: Frame | null }) {

  const imageUrl = useMemo(() => {
    if (!frame) return null;
    if (!frame.imageBlob) return null;
    return URL.createObjectURL(frame.imageBlob);
  }, [frame]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className={styles.defaultFullImageContainer}>
      {imageUrl && <Image src={imageUrl} alt="Frame" fill style={{ objectFit: "contain" }} />}
      {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
      {frame && (
        <div className={styles.defaultImageLabelsContainer}>
          <label className={styles.defaultImageLabel}>Frame ID: {frame.id}</label>
          <label className={styles.defaultImageLabel}>Camera ID: {frame.cameraId}</label>
          <label className={styles.defaultImageLabel}>View ID: {frame.viewId}</label>
          <label className={styles.defaultImageLabel}>Timestamp: {frame.timestamp.toLocaleString()}</label>
        </div>
      )}
    </div>
  );
}
