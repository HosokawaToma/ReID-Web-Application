"use client";

import PersonSnapshotList from "@/components/person_snapshot/list";
import { usePersonSnapshotAnswerSearch } from "@/hooks/personSnapshotAnswerSearch";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { useEffect, useMemo } from "react";
import { useTokenContext } from "../context/TokenContext";

export default function PersonSnapshotAnswerLabels() {
  const { token } = useTokenContext();

  // personSnapshotsAnswer用のフック
  const {
    personSnapshotAnswers,
    searchPersonSnapshotAnswers,
    setPersonIds: setPersonIdsForAnswer,
    setIsJunk: setIsJunkForAnswer,
  } = usePersonSnapshotAnswerSearch(token);

  // personSnapshots用のフック
  const {
    personSnapshots,
    searchPersonSnapshotImage,
    setIsJunk,
    searchPersonSnapshots,
  } = usePersonSnapshotSearch(token);

  // person_idの重複を除去したpersonSnapshotAnswers
  const uniquePersonSnapshotAnswers = useMemo(() => {
    const seen = new Set<string>();
    return personSnapshotAnswers.filter((answer) => {
      if (seen.has(answer.personId)) {
        return false;
      }
      seen.add(answer.personId);
      return true;
    });
  }, [personSnapshotAnswers]);

  // is_junk=FalseでフィルタリングしたpersonSnapshots
  const filteredPersonSnapshots = useMemo(() => {
    return personSnapshots.filter((snapshot) => !snapshot.isJunk);
  }, [personSnapshots]);

  // 初期ロード時に検索を実行
  useEffect(() => {
    if (!token) return;

    // personSnapshotsを検索（is_junk=False）
    setIsJunk(false);
  }, [token, setIsJunk]);

  // personSnapshotsAnswerを検索
  // 注意: フックがpersonIdsがnullの場合は検索しないため、空配列を設定して全件取得を試みる
  useEffect(() => {
    if (!token) return;
    // 空配列を設定（APIが空配列で全件取得をサポートしている場合）
    setPersonIdsForAnswer([]);
    setIsJunkForAnswer(null);
  }, [token, setPersonIdsForAnswer, setIsJunkForAnswer]);

  // personIdsが設定された後に検索を実行
  useEffect(() => {
    if (!token) return;
    searchPersonSnapshotAnswers();
  }, [token, searchPersonSnapshotAnswers]);

  useEffect(() => {
    if (!token) return;
    searchPersonSnapshots();
  }, [token, searchPersonSnapshots]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      overflow: "hidden",
      gap: "16px",
      padding: "16px"
    }}>
      {/* 左側: personSnapshotsAnswerのリスト */}
      <div style={{
        width: "30%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Person Snapshot Answers</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {uniquePersonSnapshotAnswers.map((answer) => (
            <div
              key={answer.id}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: answer.isJunk ? "#ffebee" : "#f5f5f5",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Person ID: {answer.personId}
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
                {answer.isJunk ? "JUNK" : "Valid"}
              </p>
            </div>
          ))}
          {uniquePersonSnapshotAnswers.length === 0 && (
            <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
              No person snapshot answers found
            </p>
          )}
        </div>
      </div>

      {/* 中央: personSnapshotsのリスト */}
      <div style={{
        width: "70%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Person Snapshots (is_junk=False)</h2>
        <PersonSnapshotList
          personSnapshots={filteredPersonSnapshots}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={() => {}}
        />
      </div>
    </div>
  );
}
