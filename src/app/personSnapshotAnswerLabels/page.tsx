"use client";

import PersonSnapshotList from "@/components/person_snapshot/list";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotAnswerSearch } from "@/hooks/personSnapshotAnswerSearch";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { ApiV1PersonSnapshotAnswerNewId } from "@/lib/api/v1/personSnapshotAnswerNewId";
import { toDateInputString, toDateTime, toTimeInputString } from "@/lib/util/date";
import { useMemo, useState } from "react";
import { useTokenContext } from "../context/TokenContext";

export default function PersonSnapshotAnswerLabels() {
  const { token } = useTokenContext();

  // personSnapshotsAnswer用のフック
  const {
    personSnapshotAnswers,
    searchPersonSnapshotAnswers,
    setPersonIds: setPersonIdsForAnswer,
    setIsJunk: setIsJunkForAnswer,
    setSortOrderByTimestamp: setSortOrderByTimestampForAnswer,
  } = usePersonSnapshotAnswerSearch(token);

  // personSnapshots用のフック
  const {
    personSnapshots,
    searchPersonSnapshotImage,
    setIsJunk,
    setSortOrderByTimestamp,
    afterTimestamp,
    beforeTimestamp,
    setAfterTimestamp,
    setBeforeTimestamp,
    searchPersonSnapshots,
  } = usePersonSnapshotSearch(token);

  // 選択中のpersonSnapshotsのIDを管理
  const [selectedPersonSnapshotIds, setSelectedPersonSnapshotIds] = useState<Set<string>>(new Set());

  // personSnapshotの選択をトグル
  const handlePersonSnapshotToggle = (personSnapshotId: string) => {
    setSelectedPersonSnapshotIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(personSnapshotId)) {
        newSet.delete(personSnapshotId);
      } else {
        newSet.add(personSnapshotId);
      }
      return newSet;
    });
  };

  // PersonSnapshotsで表示されているperson_idsを取得（nullを除外）
  // API側でis_junk=Falseと日付範囲でフィルタリングされているので、そのまま使用
  const displayedPersonIds = useMemo(() => {
    const personIdSet = new Set<string>();
    personSnapshots.forEach((snapshot) => {
      if (snapshot.personId) {
        personIdSet.add(snapshot.personId);
      }
    });
    return Array.from(personIdSet);
  }, [personSnapshots]);

  // person_idの重複を除去したpersonSnapshotAnswers
  // さらに、PersonSnapshotsで表示されているperson_idsのみにフィルタリング
  const uniquePersonSnapshotAnswers = useMemo(() => {
    const seen = new Set<string>();
    return personSnapshotAnswers.filter((answer) => {
      // PersonSnapshotsで表示されているperson_idsのみを含める
      if (!displayedPersonIds.includes(answer.personId)) {
        return false;
      }
      // person_idの重複を除去
      if (seen.has(answer.personId)) {
        return false;
      }
      seen.add(answer.personId);
      return true;
    });
  }, [personSnapshotAnswers, displayedPersonIds]);


  // 日付範囲変更のハンドラー
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setAfterTimestamp(null);
      setBeforeTimestamp(null);
      return;
    }
    const afterTime = afterTimestamp ? toTimeInputString(afterTimestamp) : "00:00:00";
    const beforeTime = beforeTimestamp ? toTimeInputString(beforeTimestamp) : "23:59:59";
    setAfterTimestamp(toDateTime(e.target.value, afterTime));
    setBeforeTimestamp(toDateTime(e.target.value, beforeTime));
  };

  const handleAfterTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = afterTimestamp ? toDateInputString(afterTimestamp) : toDateInputString(new Date());
    const beforeTime = beforeTimestamp ? toTimeInputString(beforeTimestamp) : "23:59:59";
    setAfterTimestamp(toDateTime(date, e.target.value));
    setBeforeTimestamp(toDateTime(date, beforeTime));
  };

  const handleBeforeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = beforeTimestamp
      ? toDateInputString(beforeTimestamp)
      : toDateInputString(new Date());
    const afterTime = afterTimestamp ? toTimeInputString(afterTimestamp) : "00:00:00";
    setBeforeTimestamp(toDateTime(date, e.target.value));
    setAfterTimestamp(toDateTime(date, afterTime));
  };

  // 検索実行ハンドラー
  const handleSearch = async () => {
    if (!token) return;
    // is_junkに関係なく全て取得、timestamp昇順で検索
    setIsJunk(null);
    setSortOrderByTimestamp("asc");
    await searchPersonSnapshots();

    // PersonSnapshotsの検索完了後、PersonSnapshotAnswerSearchも実行
    // personSnapshotsから直接person_idsを計算
    const updatedPersonIds = Array.from(new Set(
      personSnapshots
        .filter((snapshot) => snapshot.personId)
        .map((snapshot) => snapshot.personId!)
    ));

    if (updatedPersonIds.length > 0) {
      setPersonIdsForAnswer(updatedPersonIds);
      setIsJunkForAnswer(null);
      setSortOrderByTimestampForAnswer("asc");
      await searchPersonSnapshotAnswers();
    }
  };

  // 新しいIDを割り当てるハンドラー
  const handleAssignNewId = async () => {
    if (!token) return;
    if (selectedPersonSnapshotIds.size === 0) {
      alert("選択中のPersonSnapshotがありません");
      return;
    }

    try {
      const selectedIds = Array.from(selectedPersonSnapshotIds);
      await ApiV1PersonSnapshotAnswerNewId(token, {
        person_snapshot_ids: selectedIds,
        person_id: null, // person_idをnullにする
        is_junk: false, // is_junkをFalseにする
      });

      // 成功したら選択をクリアして再検索
      setSelectedPersonSnapshotIds(new Set());

      // PersonSnapshotsを再検索
      await searchPersonSnapshots();

      // PersonSnapshotAnswerSearchを使ってpersonSnapshotAnswerLabelを更新
      // personSnapshotsから直接person_idsを計算
      const updatedPersonIds = Array.from(new Set(
        personSnapshots
          .filter((snapshot) => snapshot.personId)
          .map((snapshot) => snapshot.personId!)
      ));

      if (updatedPersonIds.length > 0) {
        setPersonIdsForAnswer(updatedPersonIds);
        setIsJunkForAnswer(null);
        setSortOrderByTimestampForAnswer("asc");
        await searchPersonSnapshotAnswers();
      }

      alert("新しいIDを割り当てました");
    } catch (error) {
      alert("新しいIDの割り当てに失敗しました");
      console.error(error);
    }
  };

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
        padding: "var(--spacing-medium)"
      }}>
        <h2 style={{ marginBottom: "var(--spacing-medium)", fontSize: "var(--font-size-medium)", fontWeight: "var(--font-weight-medium)" }}>
          Person Snapshot Answers
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-small)" }}>
          {uniquePersonSnapshotAnswers.map((answer) => (
            <div
              key={answer.id}
              className={answer.isJunk ? styles.errorCard : styles.defaultCard}
            >
              <div className={styles.cardMetaDataContainer}>
                <p className={styles.cardMainMetaDataText}>
                  Person ID: {answer.personId}
                </p>
                <p className={styles.cardMetaDataText}>
                  {answer.isJunk ? "JUNK" : "Valid"}
                </p>
              </div>
            </div>
          ))}
          {uniquePersonSnapshotAnswers.length === 0 && (
            <p style={{
              color: "var(--default-secondary-text-color)",
              textAlign: "center",
              padding: "var(--spacing-large)",
              fontSize: "var(--font-size-default)"
            }}>
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
        <h2 style={{
          marginBottom: "var(--spacing-medium)",
          fontSize: "var(--font-size-medium)",
          fontWeight: "var(--font-weight-medium)"
        }}>
          Person Snapshots
        </h2>

        {/* 日付範囲指定フォーム */}
        <div className={styles.defaultFormContainer} style={{
          marginBottom: "var(--spacing-medium)",
          height: "auto",
          minHeight: "auto",
          gap: "var(--spacing-small)",
          padding: "var(--spacing-small) var(--spacing-medium)"
        }}>
          <h3 style={{
            marginBottom: "var(--spacing-medium)",
            fontSize: "var(--font-size-default)",
            fontWeight: "var(--font-weight-default)"
          }}>
            表示範囲（日付・時刻）
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--spacing-medium)"
          }}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                日付
              </label>
              <input
                id="date"
                type="date"
                value={afterTimestamp ? toDateInputString(afterTimestamp) : ""}
                onChange={handleDateChange}
                className={styles.defaultInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="afterTime" className={styles.label}>
                開始時刻
              </label>
              <input
                id="afterTime"
                type="time"
                step="1"
                value={afterTimestamp ? toTimeInputString(afterTimestamp) : ""}
                onChange={handleAfterTimeChange}
                className={styles.defaultInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="beforeTime" className={styles.label}>
                終了時刻
              </label>
              <input
                id="beforeTime"
                type="time"
                step="1"
                value={beforeTimestamp ? toTimeInputString(beforeTimestamp) : ""}
                onChange={handleBeforeTimeChange}
                className={styles.defaultInput}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleSearch}
              className={styles.primaryButton}
            >
              検索
            </button>
            <button
              type="button"
              onClick={() => {
                setAfterTimestamp(null);
                setBeforeTimestamp(null);
              }}
              className={styles.defaultButton}
            >
              範囲をクリア
            </button>
          </div>
        </div>

        {/* 新しいIDを割り当てるボタン */}
        <div style={{ marginBottom: "var(--spacing-medium)" }}>
          <button
            type="button"
            onClick={handleAssignNewId}
            disabled={selectedPersonSnapshotIds.size === 0}
            className={styles.primaryButton}
            style={{
              opacity: selectedPersonSnapshotIds.size === 0 ? 0.5 : 1,
              cursor: selectedPersonSnapshotIds.size === 0 ? "not-allowed" : "pointer"
            }}
          >
            新しいIDを割り当て ({selectedPersonSnapshotIds.size}件選択中)
          </button>
        </div>

        <PersonSnapshotList
          personSnapshots={personSnapshots}
          searchPersonSnapshotImage={searchPersonSnapshotImage}
          onClickAction={handlePersonSnapshotToggle}
          selectedPersonSnapshotIds={selectedPersonSnapshotIds}
        />
      </div>
    </div>
  );
}
