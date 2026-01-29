"use client";

import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import styles from "../styles/index.module.css";
import PersonSnapshotItem from "./item";

export interface PersonSnapshotListProps {
  personSnapshots: PersonSnapshotMetaData[];
  page: number;
  totalItems: number;
  totalPages: number;
  setPage: (page: number) => void;
  searchPersonSnapshots: () => void;
  searchPersonSnapshotImage: (personSnapshotId: string) => Promise<Blob | null>;
  onClickAction: (personSnapshotId: string) => void;
  onShowRanking?: (personSnapshotId: string) => void;
}

export default function PersonSnapshotList({
  personSnapshots,
  page,
  totalItems,
  totalPages,
  setPage,
  searchPersonSnapshots,
  searchPersonSnapshotImage,
  onClickAction,
  onShowRanking,
}: PersonSnapshotListProps) {

  const handlePageChange = (page: number) => {
    setPage(page);
    searchPersonSnapshots();
  };

  return (
    <div className={styles.listContainer}>
      {personSnapshots.map((personSnapshot) => (
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
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            className={styles.defaultButton}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            ‹
          </button>
          <span style={{ fontSize: 'var(--font-size-default)', padding: '0 var(--spacing-small)' }}>
            {page}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className={styles.defaultButton}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            className={styles.defaultButton}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
