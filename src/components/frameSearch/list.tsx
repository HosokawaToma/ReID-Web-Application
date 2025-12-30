import { Frame } from "@/types/frames";
import styles from "../styles/index.module.css";
import FrameSearchItem from "./item";

export interface FrameSearchListProps {
  frames: Frame[];
  onFrameClickAction: ((frame: Frame) => void) | null;
}

export default function FrameSearchList({ frames, onFrameClickAction }: FrameSearchListProps) {
  return (
    <div className={styles.listContainer}>
      {frames.map((frame) => (
        <FrameSearchItem
          key={frame.id}
          frame={frame}
          onFrameClickAction={onFrameClickAction}
        />
      ))}
    </div>
  );
}
