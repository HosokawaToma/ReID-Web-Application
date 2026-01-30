"use client";

import PersonSnapshotSearchForm from "@/components/personSnapshot/search_form";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { usePersonSnapshotSearchRank } from "@/hooks/personSnapshotSearchRank";
import { ApiV1PersonSnapshotAnswerAssign } from "@/lib/api/v1/personSnapshotAnswerAssign";
import { ApiV1PersonSnapshotAnswerDelete } from "@/lib/api/v1/personSnapshotAnswerDelete";
import { ApiV1PersonSnapshotAnswerSearch, PersonSnapshotAnswer } from "@/lib/api/v1/personSnapshotAnswerSearch";
import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  assignSourceSnapshotId,
  assignTargetIds,
  onSetAssignSource,
  onToggleAssignTarget,
  showAssignControls,
  onDeleteAnswer,
  deletingSnapshotId,
}: {
  personSnapshots: PersonSnapshotMetaData[];
  page: number;
  totalPages: number;
  answerBySnapshotId: Record<string, PersonSnapshotAnswer>;
  imageUrls: Record<string, string>;
  onPageChange: (page: number) => void;
  onShowRanking?: (personSnapshotId: string) => void;
  assignSourceSnapshotId?: string | null;
  assignTargetIds?: Set<string>;
  onSetAssignSource?: (personSnapshotId: string) => void;
  onToggleAssignTarget?: (personSnapshotId: string) => void;
  showAssignControls?: boolean;
  onDeleteAnswer?: (personSnapshotId: string) => void;
  deletingSnapshotId?: string | null;
}) {
  return (
    <>
      <div className={styles.listContainer}>
        {personSnapshots.map((personSnapshot) => {
          const answer = answerBySnapshotId[personSnapshot.id];
          const displayPersonId = answer != null ? (answer.person_id ?? "") : "";
          const personColors = getColorsByPersonId(displayPersonId);
          const isAssignSource = showAssignControls && assignSourceSnapshotId === personSnapshot.id;
          const isAssignTarget = showAssignControls && (assignTargetIds?.has(personSnapshot.id) ?? false);
          return (
            <div
              key={personSnapshot.id}
              style={{
                width: "100%",
                backgroundColor: isAssignTarget ? "#fef9c3" : personColors?.bg,
                border: isAssignTarget
                  ? "2px solid #f59e0b"
                  : personColors
                    ? `2px solid ${personColors.border}`
                    : "2px solid transparent",
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
                <div className={styles.cardMetaDataContainer} style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexDirection: "row", gap: "var(--spacing-medium)", alignItems: "flex-start", width: "100%" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className={styles.cardMainMetaDataText}>Person Snapshot ID: {personSnapshot.id}</p>
                      <p className={styles.cardMainMetaDataText}>Person ID: {displayPersonId}</p>
                      <p className={styles.cardMetaDataText}>Camera ID: {personSnapshot.cameraId}</p>
                      <p className={styles.cardMetaDataText}>View ID: {personSnapshot.viewId}</p>
                      <p className={styles.cardMetaDataText}>
                        Timestamp: {personSnapshot.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {((showAssignControls && onSetAssignSource && onToggleAssignTarget) || onShowRanking) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)", flexShrink: 0, alignItems: "flex-start" }}>
                        {showAssignControls && onSetAssignSource && onToggleAssignTarget && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSetAssignSource(personSnapshot.id);
                              }}
                              className={isAssignSource ? styles.primaryButton : styles.defaultButton}
                              style={{ minWidth: "6rem" }}
                            >
                              {isAssignSource ? "参照元（解除）" : "参照元にする"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleAssignTarget(personSnapshot.id);
                              }}
                              className={isAssignTarget ? styles.primaryButton : styles.defaultButton}
                              style={{ minWidth: "6rem" }}
                            >
                              {isAssignTarget ? "割り当て先を解除" : "割り当て先に追加"}
                            </button>
                          </>
                        )}
                        {onShowRanking && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowRanking(personSnapshot.id);
                            }}
                            className={styles.primaryButton}
                            style={{ minWidth: "6rem" }}
                          >
                            Show Ranking
                          </button>
                        )}
                        {onDeleteAnswer && answer != null && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteAnswer(personSnapshot.id);
                            }}
                            className={styles.defaultButton}
                            style={{ minWidth: "6rem" }}
                            disabled={deletingSnapshotId === personSnapshot.id}
                          >
                            {deletingSnapshotId === personSnapshot.id ? "削除中..." : "正解ラベル削除"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
  const [assignSourceSnapshotId, setAssignSourceSnapshotId] = useState<string | null>(null);
  const [assignTargetIds, setAssignTargetIds] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [deletingSnapshotId, setDeletingSnapshotId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [assignSourceImageUrl, setAssignSourceImageUrl] = useState<string | null>(null);
  const [assignSourceAnswer, setAssignSourceAnswer] = useState<PersonSnapshotAnswer | null>(null);
  const [answerBySnapshotId, setAnswerBySnapshotId] = useState<Record<string, PersonSnapshotAnswer>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [rankAnswerBySnapshotId, setRankAnswerBySnapshotId] = useState<Record<string, PersonSnapshotAnswer>>({});
  const [rankImageUrls, setRankImageUrls] = useState<Record<string, string>>({});
  const [rankSourceImageUrl, setRankSourceImageUrl] = useState<string | null>(null);
  const [rankSourceAnswer, setRankSourceAnswer] = useState<PersonSnapshotAnswer | null>(null);
  const rankSourceFetchCancelledRef = useRef(false);
  const assignSourceFetchCancelledRef = useRef(false);

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

  // ランキングモーダル: ランキング対象（Show Ranking を押した snapshot）の画像と正解ラベルを取得
  useEffect(() => {
    if (!token || !isRankingModalOpen || !rankPersonSnapshotId) {
      void Promise.resolve().then(() => {
        setRankSourceImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setRankSourceAnswer(null);
      });
      return;
    }
    rankSourceFetchCancelledRef.current = false;
    searchRankPersonSnapshotImage(rankPersonSnapshotId).then((blob) => {
      if (rankSourceFetchCancelledRef.current || !blob) return;
      setRankSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    });
    ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: [rankPersonSnapshotId],
      person_ids: null,
      is_junk: null,
      sort_by_list: ["created_at_desc"],
    })
      .then((res) => {
        if (rankSourceFetchCancelledRef.current) return;
        const ans =
          res.person_snapshot_answers.find((a) => a.id === rankPersonSnapshotId) ??
          res.person_snapshot_answers[0] ??
          null;
        setRankSourceAnswer(ans);
      })
      .catch(() => {
        if (!rankSourceFetchCancelledRef.current) setRankSourceAnswer(null);
      });
    return () => {
      rankSourceFetchCancelledRef.current = true;
    };
  }, [token, isRankingModalOpen, rankPersonSnapshotId, searchRankPersonSnapshotImage]);

  // 割り当て元: 参照元にした snapshot の画像と正解ラベルを取得（ページを変えても常に表示するため別取得）
  useEffect(() => {
    if (!token || !assignSourceSnapshotId) {
      void Promise.resolve().then(() => {
        setAssignSourceImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setAssignSourceAnswer(null);
      });
      return;
    }
    assignSourceFetchCancelledRef.current = false;
    searchPersonSnapshotImage(assignSourceSnapshotId).then((blob) => {
      if (assignSourceFetchCancelledRef.current || !blob) return;
      setAssignSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    });
    ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: [assignSourceSnapshotId],
      person_ids: null,
      is_junk: null,
      sort_by_list: ["created_at_desc"],
    })
      .then((res) => {
        if (assignSourceFetchCancelledRef.current) return;
        const ans =
          res.person_snapshot_answers.find((a) => a.id === assignSourceSnapshotId) ??
          res.person_snapshot_answers[0] ??
          null;
        setAssignSourceAnswer(ans);
      })
      .catch(() => {
        if (!assignSourceFetchCancelledRef.current) setAssignSourceAnswer(null);
      });
    return () => {
      assignSourceFetchCancelledRef.current = true;
    };
  }, [token, assignSourceSnapshotId, searchPersonSnapshotImage]);

  useEffect(() => {
    return () => {
      setRankSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);
  useEffect(() => {
    return () => {
      setAssignSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const handleCloseModal = () => {
    setIsRankingModalOpen(false);
  };

  const handleSetAssignSource = useCallback((personSnapshotId: string) => {
    setAssignSourceSnapshotId((prev) => (prev === personSnapshotId ? null : personSnapshotId));
  }, []);

  const handleToggleAssignTarget = useCallback((personSnapshotId: string) => {
    setAssignTargetIds((prev) => {
      const next = new Set(prev);
      if (next.has(personSnapshotId)) next.delete(personSnapshotId);
      else next.add(personSnapshotId);
      return next;
    });
  }, []);

  const handleSelectAllAssignTargets = useCallback(() => {
    if (personSnapshots.length === 0) return;
    const allIds = new Set(personSnapshots.map((s) => s.id));
    setAssignTargetIds((prev) => (prev.size === personSnapshots.length ? new Set() : allIds));
  }, [personSnapshots]);

  const handleAssign = useCallback(async () => {
    if (!token || !assignSourceSnapshotId || assignTargetIds.size === 0) return;
    setAssignError(null);
    setAssigning(true);
    try {
      await ApiV1PersonSnapshotAnswerAssign(token, {
        source_person_snapshot_id: assignSourceSnapshotId,
        target_person_snapshot_ids: Array.from(assignTargetIds),
      });
      setAssignSourceSnapshotId(null);
      setAssignTargetIds(new Set());
      searchPersonSnapshots();
    } catch (e) {
      setAssignError(e instanceof Error ? e.message : "Assign failed");
    } finally {
      setAssigning(false);
    }
  }, [token, assignSourceSnapshotId, assignTargetIds, searchPersonSnapshots]);

  const handleDeleteAnswer = useCallback(
    async (personSnapshotId: string) => {
      if (!token) return;
      setDeleteError(null);
      setDeletingSnapshotId(personSnapshotId);
      try {
        await ApiV1PersonSnapshotAnswerDelete(token, { person_snapshot_id: personSnapshotId });
        searchPersonSnapshots();
      } catch (e) {
        setDeleteError(e instanceof Error ? e.message : "正解ラベル削除に失敗しました");
      } finally {
        setDeletingSnapshotId(null);
      }
    },
    [token, searchPersonSnapshots]
  );

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
      <div
        style={{
          width: "80%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          gap: "var(--spacing-medium)",
        }}
      >
        <div
          style={{
            flex: "1 1 50%",
            minWidth: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
          {assignSourceSnapshotId && (
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-medium)",
                flexWrap: "wrap",
                marginBottom: "var(--spacing-medium)",
              }}
            >
              <span style={{ fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)", whiteSpace: "nowrap" }}>
                割り当て元:
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--spacing-medium)",
                  padding: "var(--spacing-small)",
                  borderRadius: "var(--border-radius-medium)",
                  border:
                    assignSourceAnswer != null && (assignSourceAnswer.person_id ?? "") !== ""
                      ? `2px solid ${getColorsByPersonId(assignSourceAnswer.person_id ?? "")?.border ?? "transparent"}`
                      : "2px solid var(--default-border-color)",
                  backgroundColor:
                    assignSourceAnswer != null && (assignSourceAnswer.person_id ?? "") !== ""
                      ? getColorsByPersonId(assignSourceAnswer.person_id ?? "")?.bg ?? undefined
                      : undefined,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    flexShrink: 0,
                    backgroundColor: "var(--default-background-color-secondary)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                >
                  {assignSourceImageUrl ? (
                    <Image
                      src={assignSourceImageUrl}
                      alt="割り当て元"
                      fill
                      style={{ objectFit: "contain", borderRadius: "var(--border-radius-small)" }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--font-size-small)",
                        color: "var(--default-secondary-text-color)",
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)" }}>
                  <p style={{ margin: 0, fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)" }}>
                    Person ID: {assignSourceAnswer != null ? (assignSourceAnswer.person_id ?? "") : "—"}
                  </p>
                  <p style={{ margin: 0, fontSize: "var(--font-size-small)", color: "var(--default-secondary-text-color)" }}>
                    Snapshot ID: {assignSourceSnapshotId}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-medium)",
              flexWrap: "wrap",
              marginBottom: "var(--spacing-small)",
            }}
          >
            <span style={{ fontSize: "var(--font-size-default)" }}>
              正解ラベル割り当て: 参照元を1件選択、割り当て先を1件以上選択して Assign を実行
            </span>
            {personSnapshots.length > 0 && (
              <button
                type="button"
                className={styles.defaultButton}
                onClick={handleSelectAllAssignTargets}
              >
                {assignTargetIds.size === personSnapshots.length ? "割り当て先を全解除" : "割り当て先を全選択"}
              </button>
            )}
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleAssign}
              disabled={!assignSourceSnapshotId || assignTargetIds.size === 0 || assigning}
            >
              {assigning ? "送信中..." : `Assign（${assignTargetIds.size} 件）`}
            </button>
          </div>
          {assignError && (
            <p style={{ color: "var(--error-color)", fontSize: "var(--font-size-default)", margin: "0 0 var(--spacing-small)", flexShrink: 0 }}>
              {assignError}
            </p>
          )}
          {deleteError && (
            <p style={{ color: "var(--error-color)", fontSize: "var(--font-size-default)", margin: "0 0 var(--spacing-small)", flexShrink: 0 }}>
              {deleteError}
            </p>
          )}
        </div>
        <div
          style={{
            flex: "1 1 50%",
            minWidth: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SnapshotListContent
            personSnapshots={personSnapshots}
            page={page}
            totalPages={totalPages}
            answerBySnapshotId={answerBySnapshotId}
            imageUrls={imageUrls}
            onPageChange={handlePageChange}
            onShowRanking={handleShowRanking}
            assignSourceSnapshotId={assignSourceSnapshotId}
            assignTargetIds={assignTargetIds}
            onSetAssignSource={handleSetAssignSource}
            onToggleAssignTarget={handleToggleAssignTarget}
            showAssignControls
            onDeleteAnswer={handleDeleteAnswer}
            deletingSnapshotId={deletingSnapshotId}
          />
        </div>
      </div>
      {isRankingModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "var(--spacing-large)", width: "80vw", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-medium)", flexShrink: 0 }}>
                <h2 style={{ margin: 0, fontSize: "var(--font-size-medium)" }}>Ranking Results</h2>
                <button
                  onClick={handleCloseModal}
                  className={styles.defaultButton}
                  style={{ width: "auto", padding: "var(--spacing-small) var(--spacing-medium)" }}
                >
                  Close
                </button>
              </div>
              {rankPersonSnapshotId && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-medium)", flexWrap: "wrap", marginBottom: "var(--spacing-medium)", flexShrink: 0 }}>
                  <span style={{ fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)", whiteSpace: "nowrap" }}>
                    ランキング対象（正解）:
                  </span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--spacing-medium)",
                      padding: "var(--spacing-small)",
                      borderRadius: "var(--border-radius-medium)",
                      border:
                        rankSourceAnswer != null && (rankSourceAnswer.person_id ?? "") !== ""
                          ? `2px solid ${getColorsByPersonId(rankSourceAnswer.person_id ?? "")?.border ?? "transparent"}`
                          : "2px solid var(--default-border-color)",
                      backgroundColor:
                        rankSourceAnswer != null && (rankSourceAnswer.person_id ?? "") !== ""
                          ? getColorsByPersonId(rankSourceAnswer.person_id ?? "")?.bg ?? undefined
                          : undefined,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        flexShrink: 0,
                        backgroundColor: "var(--default-background-color-secondary)",
                        borderRadius: "var(--border-radius-small)",
                      }}
                    >
                      {rankSourceImageUrl ? (
                        <Image
                          src={rankSourceImageUrl}
                          alt="ランキング対象"
                          fill
                          style={{ objectFit: "contain", borderRadius: "var(--border-radius-small)" }}
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "var(--font-size-small)",
                            color: "var(--default-secondary-text-color)",
                          }}
                        >
                          Loading...
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)" }}>
                      <p style={{ margin: 0, fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)" }}>
                        Person ID: {rankSourceAnswer != null ? (rankSourceAnswer.person_id ?? "") : "—"}
                      </p>
                      <p style={{ margin: 0, fontSize: "var(--font-size-small)", color: "var(--default-secondary-text-color)" }}>
                        Snapshot ID: {rankPersonSnapshotId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
