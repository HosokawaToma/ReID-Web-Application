"use client";

import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import { useEffect, useState } from "react";
import styles from "../styles/index.module.css";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshotMetaData[];
  searchPersonSnapshotImage: (personSnapshotId: string) => Promise<Blob | null>;
  onClickAction: (personSnapshotId: string) => void;
  selectedPersonSnapshotIds?: Set<string>;
}

export default function PersonSnapshotList({ personSnapshots, searchPersonSnapshotImage, onClickAction, selectedPersonSnapshotIds = new Set() }: PersonSnapshotListProps) {
  const MAX_ITEMS = 30;
  const [displayCount, setDisplayCount] = useState(MAX_ITEMS);
  const [visiblePersonSnapshots, setVisiblePersonSnapshots] = useState<PersonSnapshotMetaData[]>([]);

  useEffect(() => {
    setVisiblePersonSnapshots(personSnapshots.slice(0, displayCount));
  }, [personSnapshots, displayCount]);

  return (
    <div className={styles.listContainer}>
      {visiblePersonSnapshots.map((personSnapshot) => (
        <PersonSnapshotItem
          key={personSnapshot.id}
          personSnapshot={personSnapshot}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={onClickAction}
          isSelected={selectedPersonSnapshotIds.has(personSnapshot.id)}
        />
      ))}
      {displayCount < personSnapshots.length && (
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
