import { FrameMetaData } from "@/types/frames";
import { useState } from "react";
import styles from "../styles/index.module.css";
import FrameSearchItem from "./item";

export interface FrameSearchListProps {
  frameMetaDatas: FrameMetaData[];
  searchFrameImage: (frameId: string) => Promise<Blob | null>;
  onItemClickAction: ((frameId: string) => void) | null;
}

export default function FrameSearchList({
  frameMetaDatas,
  searchFrameImage,
  onItemClickAction,
}: FrameSearchListProps) {
  const MAX_ITEMS = 30;
  const [displayCount, setDisplayCount] = useState(MAX_ITEMS);

  const visibleFrameMetaDatas = frameMetaDatas.slice(0, displayCount);

  return (
    <div
      className={styles.listContainer}
      style={{ overflowY: "auto", height: "100%" }}
    >
      {visibleFrameMetaDatas.map((frameMetaData) => (
        <FrameSearchItem
          key={frameMetaData.id}
          frameMetaData={frameMetaData}
          searchFrameImage={searchFrameImage}
          onItemClickAction={onItemClickAction}
        />
      ))}
      {displayCount < frameMetaDatas.length && (
        <button
          onClick={() => setDisplayCount(displayCount + MAX_ITEMS)}
          className={styles.primaryButton}
        >
          Load More
        </button>
      )}
    </div>
  );
}
