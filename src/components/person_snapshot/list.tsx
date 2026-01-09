"use client";

import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import styles from "../styles/index.module.css";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshotMetaData[];
  searchPersonSnapshotImage: (personSnapshotId: string) => Promise<Blob | null>;
  onClickAction: (personSnapshotId: string) => void;
}

export default function PersonSnapshotList({ personSnapshots, searchPersonSnapshotImage, onClickAction }: PersonSnapshotListProps) {
  return (
    <div className={styles.listContainer}>
      {personSnapshots.map((personSnapshot) => (
        <PersonSnapshotItem
          key={personSnapshot.id}
          personSnapshot={personSnapshot}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={onClickAction}
        />
      ))}
    </div>
  );
}
