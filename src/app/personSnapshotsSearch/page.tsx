"use client";

import PersonSnapshotSearchForm from "@/components/personSnapshot/search_form";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { usePersonSnapshotSearchRank } from "@/hooks/personSnapshotSearchRank";
import { ApiV1PersonSnapshotAnswerSearch, PersonSnapshotAnswer } from "@/lib/api/v1/personSnapshotAnswerSearch";
import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTokenContext } from "../context/TokenContext";

/** 区別しやすい固定パレット（同じ person_id なら同じ色） */
const PERSON_ID_COLOR_PALETTE: { bg: string; border: string }[] = [
  { bg: "#fef2f2", border: "#dc2626" },
  { bg: "#fff7ed", border: "#ea580c" },
  { bg: "#fffbeb", border: "#d97706" },
  { bg: "#fefce8", border: "#ca8a04" },
  { bg: "#f7fee7", border: "#65a30d" },
  { bg: "#ecfdf5", border: "#059669" },
  { bg: "#f0fdfa", border: "#0d9488" },
  { bg: "#ecfeff", border: "#0891b2" },
  { bg: "#eff6ff", border: "#2563eb" },
  { bg: "#eef2ff", border: "#4f46e5" },
  { bg: "#f5f3ff", border: "#7c3aed" },
  { bg: "#faf5ff", border: "#9333ea" },
  { bg: "#fdf4ff", border: "#c026d3" },
  { bg: "#fdf2f8", border: "#db2777" },
  { bg: "#fff1f2", border: "#e11d48" },
  { bg: "#fef3c7", border: "#b45309" },
  { bg: "#d1fae5", border: "#047857" },
  { bg: "#cffafe", border: "#0e7490" },
  { bg: "#dbeafe", border: "#1d4ed8" },
  { bg: "#e0e7ff", border: "#4338ca" },
  { bg: "#ede9fe", border: "#6d28d9" },
  { bg: "#fce7f3", border: "#be185d" },
];

function getColorsByPersonId(personId: string): { bg: string; border: string } | null {
  if (personId === "") return null;
  let hash = 0;
  for (let i = 0; i < personId.length; i++) {
    hash = (hash * 31 + personId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash % PERSON_ID_COLOR_PALETTE.length);
  return PERSON_ID_COLOR_PALETTE[index];
}

function SnapshotListContent({
  personSnapshots,
  page,
  totalPages,
  answerBySnapshotId,
  imageUrls,
  onPageChange,
  onShowRanking,
}: {
  personSnapshots: PersonSnapshotMetaData[];
  page: number;
  totalPages: number;
  answerBySnapshotId: Record<string, PersonSnapshotAnswer>;
  imageUrls: Record<string, string>;
  onPageChange: (page: number) => void;
  onShowRanking?: (personSnapshotId: string) => void;
}) {
  return (
    <>
      <div className={styles.listContainer}>
        {personSnapshots.map((personSnapshot) => {
          const answer = answerBySnapshotId[personSnapshot.id];
          const displayPersonId = answer != null ? (answer.person_id ?? "") : "";
          const personColors = getColorsByPersonId(displayPersonId);
          return (
            <div
              key={personSnapshot.id}
              style={{
                width: "100%",
                backgroundColor: personColors?.bg,
                border: personColors ? `2px solid ${personColors.border}` : "2px solid transparent",
                borderRadius: "var(--border-radius-medium)",
                boxSizing: "border-box",
              }}
            >
              <div className={personSnapshot.isJunk ? styles.errorCard : styles.defaultCard}>
                <div className={personSnapshot.isJunk ? styles.errorImageContainer : styles.defaultImageContainer}>
                  <div className={personSnapshot.isJunk ? styles.errorImageBackground : styles.defaultImageBackground}>
                    {personSnapshot.isJunk && <div className={styles.errorImageLabel}>JUNK</div>}
                    {imageUrls[personSnapshot.id] ? (
                      <Image
                        src={imageUrls[personSnapshot.id]}
                        alt="Person Snapshot"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div className={styles.imageLoading}>Loading...</div>
                    )}
                  </div>
                </div>
                <div className={styles.cardMetaDataContainer}>
                  <p className={styles.cardMainMetaDataText}>Person Snapshot ID: {personSnapshot.id}</p>
                  <p className={styles.cardMainMetaDataText}>Person ID: {displayPersonId}</p>
                  <p className={styles.cardMetaDataText}>Camera ID: {personSnapshot.cameraId}</p>
                  <p className={styles.cardMetaDataText}>View ID: {personSnapshot.viewId}</p>
                  <p className={styles.cardMetaDataText}>
                    Timestamp: {personSnapshot.timestamp.toLocaleString()}
                  </p>
                  {onShowRanking && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowRanking(personSnapshot.id);
                      }}
                      className={styles.primaryButton}
                      style={{ marginTop: "var(--spacing-small)" }}
                    >
                      Show Ranking
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5vw",
            marginTop: "var(--spacing-large)",
          }}
        >
          <button
            onClick={() => onPageChange(1)}
            className={styles.defaultButton}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            «
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            className={styles.defaultButton}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            ‹
          </button>
          <span style={{ fontSize: "var(--font-size-default)", padding: "0 var(--spacing-small)" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            className={styles.defaultButton}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            ›
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className={styles.defaultButton}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            »
          </button>
        </div>
      )}
    </>
  );
}

export default function PersonSnapshotsSearch() {
  const { token } = useTokenContext();
  const {
    personIds,
    cameraIds,
    viewIds,
    isJunk,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    page,
    totalPages,
    personSnapshots,
    setPersonIds,
    setCameraIds,
    setViewIds,
    setIsJunk,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    setPage,
    searchPersonSnapshots,
    searchPersonSnapshotImage,
  } = usePersonSnapshotSearch(token);

  const {
    personSnapshotId: rankPersonSnapshotId,
    page: rankPage,
    totalPages: rankTotalPages,
    personSnapshots: rankPersonSnapshots,
    setPersonSnapshotId: setRankPersonSnapshotId,
    setPage: setRankPage,
    searchPersonSnapshotRank,
    searchPersonSnapshotImage: searchRankPersonSnapshotImage,
  } = usePersonSnapshotSearchRank(token);

  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [answerBySnapshotId, setAnswerBySnapshotId] = useState<Record<string, PersonSnapshotAnswer>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [rankAnswerBySnapshotId, setRankAnswerBySnapshotId] = useState<Record<string, PersonSnapshotAnswer>>({});
  const [rankImageUrls, setRankImageUrls] = useState<Record<string, string>>({});

  const handleShowRanking = async (personSnapshotId: string) => {
    setRankPersonSnapshotId(personSnapshotId);
    setIsRankingModalOpen(true);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      searchPersonSnapshots();
    },
    [setPage, searchPersonSnapshots]
  );

  const handleRankPageChange = useCallback(
    (newPage: number) => {
      setRankPage(newPage);
      searchPersonSnapshotRank();
    },
    [setRankPage, searchPersonSnapshotRank]
  );

  useEffect(() => {
    if (isRankingModalOpen && rankPersonSnapshotId) {
      searchPersonSnapshotRank();
    }
  }, [isRankingModalOpen, rankPersonSnapshotId, searchPersonSnapshotRank]);

  const handleCloseModal = () => {
    setIsRankingModalOpen(false);
  };

  // メイン検索結果: Answer Search（answer.id = person snapshot id で紐付け）
  useEffect(() => {
    if (!token || personSnapshots.length === 0) {
      void Promise.resolve().then(() => setAnswerBySnapshotId({}));
      return;
    }
    const snapshotIds = personSnapshots.map((s) => s.id);
    ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: snapshotIds,
      person_ids: null,
      is_junk: null,
      sort_by_list: ["created_at_desc"],
    })
      .then((res) => {
        const byId: Record<string, PersonSnapshotAnswer> = {};
        res.person_snapshot_answers.forEach((ans) => {
          byId[ans.id] = ans;
        });
        setAnswerBySnapshotId(byId);
      })
      .catch(() => setAnswerBySnapshotId({}));
  }, [token, personSnapshots]);

  // メイン検索結果: 画像取得
  useEffect(() => {
    if (!token || personSnapshots.length === 0) return;
    let cancelled = false;
    personSnapshots.forEach((s) => {
      searchPersonSnapshotImage(s.id).then((blob) => {
        if (cancelled || !blob) return;
        setImageUrls((prev) => ({ ...prev, [s.id]: URL.createObjectURL(blob) }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [token, personSnapshots, searchPersonSnapshotImage]);

  // ランキング結果: Answer Search
  useEffect(() => {
    if (!token || rankPersonSnapshots.length === 0) {
      void Promise.resolve().then(() => setRankAnswerBySnapshotId({}));
      return;
    }
    const snapshotIds = rankPersonSnapshots.map((s) => s.id);
    ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: snapshotIds,
      person_ids: null,
      is_junk: null,
      sort_by_list: ["created_at_desc"],
    })
      .then((res) => {
        const byId: Record<string, PersonSnapshotAnswer> = {};
        res.person_snapshot_answers.forEach((ans) => {
          byId[ans.id] = ans;
        });
        setRankAnswerBySnapshotId(byId);
      })
      .catch(() => setRankAnswerBySnapshotId({}));
  }, [token, rankPersonSnapshots]);

  // ランキング結果: 画像取得
  useEffect(() => {
    if (!token || rankPersonSnapshots.length === 0) return;
    let cancelled = false;
    rankPersonSnapshots.forEach((s) => {
      searchRankPersonSnapshotImage(s.id).then((blob) => {
        if (cancelled || !blob) return;
        setRankImageUrls((prev) => ({ ...prev, [s.id]: URL.createObjectURL(blob) }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [token, rankPersonSnapshots, searchRankPersonSnapshotImage]);

  return (
    <>
      <div style={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PersonSnapshotSearchForm
          personIds={personIds}
          cameraIds={cameraIds}
          viewIds={viewIds}
          isJunk={isJunk}
          afterTimestamp={afterTimestamp}
          beforeTimestamp={beforeTimestamp}
          sortOrderByTimestamp={sortOrderByTimestamp}
          setPersonIds={setPersonIds}
          setCameraIds={setCameraIds}
          setViewIds={setViewIds}
          setIsJunk={setIsJunk}
          setAfterTimestamp={setAfterTimestamp}
          setBeforeTimestamp={setBeforeTimestamp}
          setSortOrderByTimestamp={setSortOrderByTimestamp}
          personIdsOption={[]}
          cameraIdsOption={[]}
          viewIdsOption={[]}
          onSubmitAction={searchPersonSnapshots}
        />
        <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <SnapshotListContent
            personSnapshots={personSnapshots}
            page={page}
            totalPages={totalPages}
            answerBySnapshotId={answerBySnapshotId}
            imageUrls={imageUrls}
            onPageChange={handlePageChange}
            onShowRanking={handleShowRanking}
          />
        </div>
      </div>
      {isRankingModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "var(--spacing-large)", width: "80vw", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-medium)" }}>
                <h2 style={{ margin: 0, fontSize: "var(--font-size-medium)" }}>Ranking Results</h2>
                <button
                  onClick={handleCloseModal}
                  className={styles.defaultButton}
                  style={{ width: "auto", padding: "var(--spacing-small) var(--spacing-medium)" }}
                >
                  Close
                </button>
              </div>
              <div style={{ overflow: "auto", flex: 1 }}>
                <SnapshotListContent
                  personSnapshots={rankPersonSnapshots}
                  page={rankPage}
                  totalPages={rankTotalPages}
                  answerBySnapshotId={rankAnswerBySnapshotId}
                  imageUrls={rankImageUrls}
                  onPageChange={handleRankPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
