"use client";

import { PersonSnapshot } from "@/types/personSnapshots";
import styles from "../styles/index.module.css";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshot[];
  onPersonIdClickAction: (personId: string) => void;
}

export default function PersonSnapshotList({ personSnapshots, onPersonIdClickAction }: PersonSnapshotListProps) {
  return (
    <div className={styles.listContainer}>
      {personSnapshots.map((personSnapshot) => (
        <PersonSnapshotItem
          key={personSnapshot.id}
          personSnapshot={personSnapshot}
          onPersonIdClickAction={onPersonIdClickAction}
        />
      ))}
    </div>
  );
}
