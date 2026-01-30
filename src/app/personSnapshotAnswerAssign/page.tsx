"use client";

import { useTokenContext } from "@/app/context/TokenContext";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotAnswerAssign } from "@/hooks/personSnapshotAnswerAssign";
import { usePersonSnapshotSearchNearest } from "@/hooks/personSnapshotSearchNearest";
import { ApiV1PersonSnapshotAnswerDelete } from "@/lib/api/v1/personSnapshotAnswerDelete";
import { ApiV1PersonSnapshotAnswerSearch, PersonSnapshotAnswer } from "@/lib/api/v1/personSnapshotAnswerSearch";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
  { bg: "#fef9c3", border: "#eab308" },
  { bg: "#dcfce7", border: "#16a34a" },
  { bg: "#ccfbf1", border: "#0f766e" },
  { bg: "#e0f2fe", border: "#0284c7" },
  { bg: "#ddd6fe", border: "#5b21b6" },
  { bg: "#fae8ff", border: "#a21caf" },
  { bg: "#ffe4e6", border: "#f43f5e" },
  { bg: "#fed7aa", border: "#c2410c" },
  { bg: "#fef08a", border: "#a16207" },
  { bg: "#bbf7d0", border: "#15803d" },
  { bg: "#99f6e4", border: "#0d5c52" },
  { bg: "#bae6fd", border: "#0369a1" },
  { bg: "#c4b5fd", border: "#4c1d95" },
  { bg: "#f5d0fe", border: "#86198f" },
  { bg: "#fecdd3", border: "#e11d48" },
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

function toggleSelection(selected: Set<string>, id: string): Set<string> {
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export default function PersonSnapshotAnswerAssignPage() {
  const { token } = useTokenContext();
  const {
    personSnapshotId,
    page,
    totalItems,
    totalPages,
    personSnapshots,
    setPersonSnapshotId,
    setPage,
    searchPersonSnapshotNearest,
    searchPersonSnapshotImage,
  } = usePersonSnapshotSearchNearest(token);

  const {
    sourcePersonSnapshotId,
    targetPersonSnapshotIds,
    setSourcePersonSnapshotId,
    setTargetPersonSnapshotIds,
    assignPersonSnapshotAnswer,
  } = usePersonSnapshotAnswerAssign(token);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [deletingSnapshotId, setDeletingSnapshotId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const assignRequestedRef = useRef(false);
  const [answerBySnapshotId, setAnswerBySnapshotId] = useState<Record<string, PersonSnapshotAnswer>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [sourceAnswer, setSourceAnswer] = useState<PersonSnapshotAnswer | null>(null);
  const [sourceDataRefreshKey, setSourceDataRefreshKey] = useState(0);

  // 検索対象（ソース）ID の画像と正解ラベル（Answer の person_id）を取得
  const sourceSnapshotId = personSnapshotId.trim();
  const sourceFetchCancelledRef = useRef(false);
  useEffect(() => {
    if (!token || !sourceSnapshotId) {
      void Promise.resolve().then(() => {
        setSourceImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setSourceAnswer(null);
      });
      return;
    }
    sourceFetchCancelledRef.current = false;
    searchPersonSnapshotImage(sourceSnapshotId).then((blob) => {
      if (sourceFetchCancelledRef.current || !blob) return;
      setSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    });
    ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: [sourceSnapshotId],
      person_ids: null,
      is_junk: null,
      sort_by_list: ["created_at_desc"],
    })
      .then((res) => {
        if (sourceFetchCancelledRef.current) return;
        const ans = res.person_snapshot_answers.find((a) => a.id === sourceSnapshotId) ?? res.person_snapshot_answers[0] ?? null;
        setSourceAnswer(ans);
      })
      .catch(() => {
        if (!sourceFetchCancelledRef.current) setSourceAnswer(null);
      });
    return () => {
      sourceFetchCancelledRef.current = true;
    };
  }, [token, sourceSnapshotId, searchPersonSnapshotImage, sourceDataRefreshKey]);

  useEffect(() => {
    return () => {
      setSourceImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  // 検索結果の snapshot 一覧に応じて Answer Search で person_id を取得（answer.id = person snapshot id で紐付け）
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

  // 各 snapshot の画像を取得
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

  // 参照元・作成先を setter で設定したあと、状態反映後に API を叩く
  useEffect(() => {
    if (!assignRequestedRef.current) return;
    if (!sourcePersonSnapshotId || targetPersonSnapshotIds.length === 0) return;

    assignRequestedRef.current = false;
    assignPersonSnapshotAnswer()
      .then(() => {
        setSelectedIds(new Set());
        searchPersonSnapshotNearest();
        setSourceDataRefreshKey((k) => k + 1);
      })
      .catch((e) => setAssignError(e instanceof Error ? e.message : "Assign failed"))
      .finally(() => setAssigning(false));
  }, [sourcePersonSnapshotId, targetPersonSnapshotIds, assignPersonSnapshotAnswer, searchPersonSnapshotNearest]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => toggleSelection(prev, id));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (personSnapshots.length === 0) return;
    const allIds = new Set(personSnapshots.map((s) => s.id));
    setSelectedIds((prev) => (prev.size === personSnapshots.length ? new Set() : allIds));
  }, [personSnapshots]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      searchPersonSnapshotNearest();
    },
    [setPage, searchPersonSnapshotNearest]
  );

  const handleAssign = useCallback(() => {
    if (!personSnapshotId.trim() || selectedIds.size === 0) return;
    setAssignError(null);
    setAssigning(true);
    assignRequestedRef.current = true;
    // 参照元 = 検索に使っている ID、作成先 = 検索結果から複数選択した ID
    setSourcePersonSnapshotId(personSnapshotId.trim());
    setTargetPersonSnapshotIds(Array.from(selectedIds));
  }, [personSnapshotId, selectedIds, setSourcePersonSnapshotId, setTargetPersonSnapshotIds]);

  const handleDeleteAnswer = useCallback(
    async (personSnapshotIdToDelete: string) => {
      if (!token) return;
      setDeleteError(null);
      setDeletingSnapshotId(personSnapshotIdToDelete);
      try {
        await ApiV1PersonSnapshotAnswerDelete(token, { person_snapshot_id: personSnapshotIdToDelete });
        searchPersonSnapshotNearest();
        setSourceDataRefreshKey((k) => k + 1);
      } catch (e) {
        setDeleteError(e instanceof Error ? e.message : "正解ラベル削除に失敗しました");
      } finally {
        setDeletingSnapshotId(null);
      }
    },
    [token, searchPersonSnapshotNearest]
  );

  const canAssign = Boolean(personSnapshotId && selectedIds.size > 0 && !assigning);

  return (
    <div
      style={{
        width: "80%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        gap: "var(--spacing-medium)",
      }}>
      <div
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "var(--spacing-medium)",
          gap: "var(--spacing-medium)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "var(--font-size-medium)" }}>
          Person Snapshot Answer Assign
        </h2>
        <p style={{ margin: 0, fontSize: "var(--font-size-default)", color: "var(--default-secondary-text-color)" }}>
          ソースの Person Snapshot ID を入力して Nearest 検索し、結果から複数選択して Assign します。
        </p>
        <div style={{ display: "flex", gap: "var(--spacing-medium)", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-small)" }}>
            <span style={{ fontSize: "var(--font-size-default)", whiteSpace: "nowrap" }}>
              Source Person Snapshot ID:
            </span>
            <input
              type="text"
              className={styles.defaultInput}
              value={personSnapshotId}
              onChange={(e) => setPersonSnapshotId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPersonSnapshotNearest()}
              placeholder="e.g. xxx-xxx-xxx"
              style={{ width: "20rem" }}
            />
          </label>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={searchPersonSnapshotNearest}
            disabled={!personSnapshotId}
          >
            検索
          </button>
        </div>
        {sourceSnapshotId && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-medium)", flexWrap: "wrap" }}>
            <span style={{ fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)", whiteSpace: "nowrap" }}>
              検索対象（正解）:
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--spacing-medium)",
                padding: "var(--spacing-small)",
                borderRadius: "var(--border-radius-medium)",
                border: sourceAnswer != null && (sourceAnswer.person_id ?? "") !== ""
                  ? `2px solid ${getColorsByPersonId(sourceAnswer.person_id ?? "")?.border ?? "transparent"}`
                  : "2px solid var(--default-border-color)",
                backgroundColor:
                  sourceAnswer != null && (sourceAnswer.person_id ?? "") !== ""
                    ? getColorsByPersonId(sourceAnswer.person_id ?? "")?.bg ?? undefined
                    : undefined,
                boxSizing: "border-box",
              }}
            >
              <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0, backgroundColor: "var(--default-background-color-secondary)", borderRadius: "var(--border-radius-small)" }}>
                {sourceImageUrl ? (
                  <Image
                    src={sourceImageUrl}
                    alt="検索対象"
                    fill
                    style={{ objectFit: "contain", borderRadius: "var(--border-radius-small)" }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-size-small)", color: "var(--default-secondary-text-color)" }}>
                    Loading...
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)" }}>
                <p style={{ margin: 0, fontSize: "var(--font-size-default)", fontWeight: "var(--font-weight-default)" }}>
                  Person ID: {sourceAnswer != null ? (sourceAnswer.person_id ?? "") : "—"}
                </p>
                <p style={{ margin: 0, fontSize: "var(--font-size-small)", color: "var(--default-secondary-text-color)" }}>
                  Snapshot ID: {sourceSnapshotId}
                </p>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)", flexShrink: 0 }}>
          <span style={{ fontSize: "var(--font-size-default)" }}>
            {totalItems > 0 ? `${totalItems} 件` : "検索結果なし"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-medium)", flexWrap: "wrap" }}>
            {personSnapshots.length > 0 && (
              <button
                type="button"
                className={styles.defaultButton}
                onClick={handleSelectAll}
              >
                {selectedIds.size === personSnapshots.length ? "全選択解除" : "全て選択"}
              </button>
            )}
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleAssign}
              disabled={!canAssign}
            >
              {assigning ? "送信中..." : `Assign（${selectedIds.size} 件）`}
            </button>
          </div>
        </div>
        {assignError && (
          <p style={{ color: "var(--error-color)", fontSize: "var(--font-size-default)", margin: "0 0 var(--spacing-small)" }}>
            {assignError}
          </p>
        )}
        {deleteError && (
          <p style={{ color: "var(--error-color)", fontSize: "var(--font-size-default)", margin: "0 0 var(--spacing-small)" }}>
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
        <div className={styles.listContainer} style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {personSnapshots.map((personSnapshot) => {
            const isSelected = selectedIds.has(personSnapshot.id);
            const answer = answerBySnapshotId[personSnapshot.id];
            const displayPersonId = answer != null ? (answer.person_id ?? "") : "";
            const personColors = getColorsByPersonId(displayPersonId);
            return (
              <div
                key={personSnapshot.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggleSelect(personSnapshot.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleSelect(personSnapshot.id);
                  }
                }}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#fef9c3" : personColors?.bg,
                  border:
                    isSelected ? "2px solid #f59e0b" : personColors ? `2px solid ${personColors.border}` : "2px solid transparent",
                  borderRadius: "var(--border-radius-medium)",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className={personSnapshot.isJunk ? styles.errorCard : styles.defaultCard}
                  style={personColors ? { backgroundColor: personColors.bg } : undefined}
                >
                  <div className={personSnapshot.isJunk ? styles.errorImageContainer : styles.defaultImageContainer}>
                    <div className={personSnapshot.isJunk ? styles.errorImageBackground : styles.defaultImageBackground}>
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
                  <div className={styles.cardMetaDataContainer} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-medium)", width: "100%" }}>
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
                    </div>
                    {answer != null && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)", flexShrink: 0, alignItems: "flex-start" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnswer(personSnapshot.id);
                          }}
                          className={styles.defaultButton}
                          style={{ minWidth: "6rem" }}
                          disabled={deletingSnapshotId === personSnapshot.id}
                        >
                          {deletingSnapshotId === personSnapshot.id ? "削除中..." : "正解ラベル削除"}
                        </button>
                      </div>
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
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => handlePageChange(1)}
              className={styles.defaultButton}
              disabled={page === 1}
              style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
            >
              «
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
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
              onClick={() => handlePageChange(page + 1)}
              className={styles.defaultButton}
              disabled={page === totalPages}
              style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={styles.defaultButton}
              disabled={page === totalPages}
              style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
