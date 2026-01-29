import { FrameMetaData } from "@/types/frames";
import styles from "../styles/index.module.css";
import FrameSearchItem from "./item";

export interface FrameSearchListProps {
  frameMetaDatas: FrameMetaData[];
  searchFrameImage: (frameId: string) => Promise<Blob | null>;
  onItemClickAction: ((frameId: string) => void) | null;
  page: number;
  totalItems: number;
  totalPages: number;
  setPage: (page: number) => void;
  searchFrames: () => void;
}

export default function FrameSearchList({
  frameMetaDatas,
  searchFrameImage,
  onItemClickAction,
  page,
  totalItems,
  totalPages,
  setPage,
  searchFrames,
}: FrameSearchListProps) {

  const handlePageChange = (page: number) => {
    setPage(page);
    searchFrames();
  };

  return (
    <div
      className={styles.listContainer}
      style={{ overflowY: "auto", height: "100%" }}
    >
      {frameMetaDatas.map((frameMetaData) => (
        <FrameSearchItem
          key={frameMetaData.id}
          frameMetaData={frameMetaData}
          searchFrameImage={searchFrameImage}
          onItemClickAction={onItemClickAction}
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
