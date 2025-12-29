"use client";

import { PersonSnapshot } from "@/types/personSnapshots";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshot[];
  onPersonIdClickAction: (personId: string) => void;
}

export default function PersonSnapshotList({ personSnapshots, onPersonIdClickAction }: PersonSnapshotListProps) {
  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
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
