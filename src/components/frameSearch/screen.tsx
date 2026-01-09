import { FrameMetaData } from "@/types/frames";
import Image from "next/image";
import styles from "../styles/index.module.css";


export default function FrameSearchScreen({ frameMetadata, frameImage }: { frameMetadata: FrameMetaData | null, frameImage: Blob | null }) {
  const imageUrl = frameImage ? URL.createObjectURL(frameImage) : null;
  return (
    <div className={styles.defaultFullImageContainer}>
      {imageUrl && <Image src={imageUrl} alt="Frame" fill style={{ objectFit: "contain" }} />}
      {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
      {frameMetadata && (
        <div className={styles.defaultImageLabelsContainer}>
          <label className={styles.defaultImageLabel}>Frame ID: {frameMetadata.id}</label>
          <label className={styles.defaultImageLabel}>Camera ID: {frameMetadata.cameraId}</label>
          <label className={styles.defaultImageLabel}>View ID: {frameMetadata.viewId}</label>
          <label className={styles.defaultImageLabel}>Timestamp: {frameMetadata.timestamp.toLocaleString()}</label>
        </div>
      )}
    </div>
  );
}
