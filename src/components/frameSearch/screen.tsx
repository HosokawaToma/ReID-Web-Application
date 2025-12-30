import { Frame } from "@/types/frames";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import styles from "../styles/index.module.css";

export default function FrameSearchScreen({ frame }: { frame: Frame }) {

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
    <div className={styles.defaultFullImageContainer}>
        <div className={styles.defaultFullImageBackground}>
        {imageUrl && <Image src={imageUrl} alt="Frame" fill style={{ objectFit: "contain" }} />}
        {!imageUrl && <div>Loading...</div>}
      </div>
    </div>
  );
}
