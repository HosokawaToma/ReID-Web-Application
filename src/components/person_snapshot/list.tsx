"use client";

import { PersonSnapshot } from "@/types/personSnapshots";
import PersonSnapshotItem from "./item";
import styles from "./list.module.css";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshot[];
  onPersonIdClickAction: (personId: string) => void;
}

export default function PersonSnapshotList({ personSnapshots, onPersonIdClickAction }: PersonSnapshotListProps) {
  return (
    <div className={styles.container}>
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
