"use client";

import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import { useMemo, useState } from "react";
import styles from "../styles/index.module.css";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshotMetaData[];
  searchPersonSnapshotImage: (personSnapshotId: string) => Promise<Blob | null>;
  onClickAction: (personSnapshotId: string) => void;
  onShowRanking?: (personSnapshotId: string) => void;
}

export default function PersonSnapshotList({ personSnapshots, searchPersonSnapshotImage, onClickAction, onShowRanking }: PersonSnapshotListProps) {
  const MAX_ITEMS = 30;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(personSnapshots.length / MAX_ITEMS);

  const visiblePersonSnapshots = useMemo(() => {
    const startIndex = (currentPage - 1) * MAX_ITEMS;
    const endIndex = startIndex + MAX_ITEMS;
    return personSnapshots.slice(startIndex, endIndex);
  }, [personSnapshots, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.listContainer}>
      {visiblePersonSnapshots.map((personSnapshot) => (
        <PersonSnapshotItem
          key={personSnapshot.id}
          personSnapshot={personSnapshot}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={onClickAction}
          onShowRanking={onShowRanking}
        />
      ))}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5vw', marginTop: 'var(--spacing-large)' }}>
          <button
            onClick={() => handlePageChange(1)}
            className={styles.defaultButton}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={styles.defaultButton}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            ‹
          </button>
          <span style={{ fontSize: 'var(--font-size-default)', padding: '0 var(--spacing-small)' }}>
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={styles.defaultButton}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            className={styles.defaultButton}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
