"use client";

import { useTokenContext } from "@/app/context/TokenContext";
import PersonSnapshotItem from "@/components/personSnapshot/item";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotAnswerAssign } from "@/hooks/personSnapshotAnswerAssign";
import { usePersonSnapshotSearchNearest } from "@/hooks/personSnapshotSearchNearest";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const assignRequestedRef = useRef(false);

  // 参照元・作成先を setter で設定したあと、状態反映後に API を叩く
  useEffect(() => {
    if (!assignRequestedRef.current) return;
    if (!sourcePersonSnapshotId || targetPersonSnapshotIds.length === 0) return;

    assignRequestedRef.current = false;
    assignPersonSnapshotAnswer()
      .then(() => setSelectedIds(new Set()))
      .catch((e) => setAssignError(e instanceof Error ? e.message : "Assign failed"))
      .finally(() => setAssigning(false));
  }, [sourcePersonSnapshotId, targetPersonSnapshotIds, assignPersonSnapshotAnswer]);

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

  const canAssign = Boolean(personSnapshotId && selectedIds.size > 0 && !assigning);

  return (
    <div
      style={{
        width: "80%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
      <div style={{ flexShrink: 0, padding: "var(--spacing-medium)", display: "flex", flexDirection: "column", gap: "var(--spacing-medium)" }}>
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
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", marginTop: "var(--spacing-medium)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-small)", flexShrink: 0 }}>
          <span style={{ fontSize: "var(--font-size-default)" }}>
            {totalItems > 0 ? `${totalItems} 件` : "検索結果なし"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-medium)" }}>
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
        <div className={styles.listContainer} style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {personSnapshots.map((personSnapshot) => (
            <div
              key={personSnapshot.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-medium)",
                width: "100%",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "80px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(personSnapshot.id)}
                  onChange={() => handleToggleSelect(personSnapshot.id)}
                  style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                />
              </label>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p>{personSnapshot.id}</p>
                <PersonSnapshotItem
                  personSnapshot={personSnapshot}
                  searchPersonSnapshotImage={searchPersonSnapshotImage}
                  onClickAction={() => handleToggleSelect(personSnapshot.id)}
                />
              </div>
            </div>
          ))}
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
