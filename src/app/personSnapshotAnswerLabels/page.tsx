"use client";

import PersonSnapshotList from "@/components/person_snapshot/list";
import styles from "@/components/styles/index.module.css";
import { usePersonSnapshotAnswerSearch } from "@/hooks/personSnapshotAnswerSearch";
import { usePersonSnapshotSearch } from "@/hooks/personSnapshotSearch";
import { ApiV1PersonSnapshotAnswerNewId } from "@/lib/api/v1/personSnapshotAnswerNewId";
import { toDateInputString, toDateTime, toTimeInputString } from "@/lib/util/date";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

  // 選択中のPersonSnapshotAnswerのIDを管理（一度に1つだけ）
  const [selectedPersonSnapshotAnswerId, setSelectedPersonSnapshotAnswerId] = useState<string | null>(null);

  // PersonSnapshotAnswerの選択を切り替え
  const handlePersonSnapshotAnswerToggle = (answerId: string) => {
    setSelectedPersonSnapshotAnswerId((prev) => {
      if (prev === answerId) {
        return null; // 同じアイテムをクリックしたら選択解除
      }
      return answerId; // 新しいアイテムを選択
    });
  };

  // personIdの重複を除去したpersonSnapshotAnswers
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

  // 各PersonSnapshotAnswerの画像URLを管理
  const [answerImageUrls, setAnswerImageUrls] = useState<Record<string, string>>({});

  // answer.idを使って画像を取得
  useEffect(() => {
    if (!token || uniquePersonSnapshotAnswers.length === 0) return;

    const fetchImages = async () => {
      // 各画像を並列で取得（エラーが発生しても他の画像取得は続行）
      const imagePromises = uniquePersonSnapshotAnswers.map(async (answer) => {
        try {
          const imageBlob = await searchPersonSnapshotImage(answer.id);
          if (imageBlob) {
            return { id: answer.id, url: URL.createObjectURL(imageBlob) };
          }
          return null;
        } catch (error) {
          // エラーが発生してもログに記録するだけで、処理は続行
          console.error(`Failed to load image for answer ${answer.id}:`, error);
          return null;
        }
      });

      // すべての画像取得を待つ（エラーが発生しても続行）
      const results = await Promise.allSettled(imagePromises);

      // 取得できた画像URLを設定（エラーが発生したアイテムは画像なしで表示される）
      const newImageUrls: Record<string, string> = {};
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          newImageUrls[result.value.id] = result.value.url;
        }
      });

      setAnswerImageUrls((prev) => ({ ...prev, ...newImageUrls }));
    };

    fetchImages();
  }, [uniquePersonSnapshotAnswers, token, searchPersonSnapshotImage]);

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
    // personSnapshotsを検索
    setIsJunk(null);
    await searchPersonSnapshots();

    // personSnapshotAnswersも同じ条件で検索
    setPersonIdsForAnswer(null);
    setIsJunkForAnswer(null);
    await searchPersonSnapshotAnswers();
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
      setIsJunk(null);
      await searchPersonSnapshots();

      // personSnapshotAnswersも同じ条件で再検索
      setPersonIdsForAnswer(null);
      setIsJunkForAnswer(null);
      await searchPersonSnapshotAnswers();

      alert("新しいIDを割り当てました");
    } catch (error) {
      alert("新しいIDの割り当てに失敗しました");
      console.error(error);
    }
  };

  // 同じIDを割り当てるハンドラー
  const handleAssignSameId = async () => {
    if (!token) return;
    if (selectedPersonSnapshotIds.size === 0) {
      alert("選択中のPersonSnapshotがありません");
      return;
    }
    if (!selectedPersonSnapshotAnswerId) {
      alert("選択中のPersonSnapshotAnswerがありません");
      return;
    }

    // 選択中のPersonSnapshotAnswerのperson_idを取得
    const selectedAnswer = uniquePersonSnapshotAnswers.find(
      (answer) => answer.id === selectedPersonSnapshotAnswerId
    );
    if (!selectedAnswer) {
      alert("選択中のPersonSnapshotAnswerが見つかりません");
      return;
    }

    try {
      const selectedIds = Array.from(selectedPersonSnapshotIds);
      await ApiV1PersonSnapshotAnswerNewId(token, {
        person_snapshot_ids: selectedIds,
        person_id: selectedAnswer.personId, // 選択中のPersonSnapshotAnswerのperson_idを割り当て
        is_junk: false, // is_junkをFalseにする
      });

      // 成功したら選択をクリアして再検索
      setSelectedPersonSnapshotIds(new Set());

      // PersonSnapshotsを再検索
      setIsJunk(null);
      await searchPersonSnapshots();

      // personSnapshotAnswersも同じ条件で再検索
      setPersonIdsForAnswer(null);
      setIsJunkForAnswer(null);
      await searchPersonSnapshotAnswers();

      alert("同じIDを割り当てました");
    } catch (error) {
      alert("同じIDの割り当てに失敗しました");
      console.error(error);
    }
  };

  // ゴミデータを割り当てるハンドラー
  const handleAssignJunk = async () => {
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
        is_junk: true, // is_junkをTrueにする
      });

      // 成功したら選択をクリアして再検索
      setSelectedPersonSnapshotIds(new Set());

      // PersonSnapshotsを再検索
      setIsJunk(null);
      await searchPersonSnapshots();

      // personSnapshotAnswersも同じ条件で再検索
      setPersonIdsForAnswer(null);
      setIsJunkForAnswer(null);
      await searchPersonSnapshotAnswers();

      alert("ゴミデータを割り当てました");
    } catch (error) {
      alert("ゴミデータの割り当てに失敗しました");
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
          {uniquePersonSnapshotAnswers.map((answer) => {
            const imageUrl = answerImageUrls[answer.id];
            const isSelected = selectedPersonSnapshotAnswerId === answer.id;
            return (
              <div
                key={answer.id}
                className={answer.isJunk ? styles.errorCard : styles.defaultCard}
                onClick={() => handlePersonSnapshotAnswerToggle(answer.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#ffeb3b" : undefined,
                  borderColor: isSelected ? "#fbc02d" : undefined,
                  borderWidth: isSelected ? "2px" : undefined,
                }}
              >
                <div className={answer.isJunk ? styles.errorImageContainer : styles.defaultImageContainer}>
                  <div className={answer.isJunk ? styles.errorImageBackground : styles.defaultImageBackground}>
                    {answer.isJunk && <div className={styles.errorImageLabel}>JUNK</div>}
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Person Snapshot Image"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    {!imageUrl && <div className={styles.imageLoading}>Loading...</div>}
                  </div>
                </div>
                <div className={styles.cardMetaDataContainer}>
                  <p className={styles.cardMainMetaDataText}>
                    ID: {answer.id}
                  </p>
                  <p className={styles.cardMainMetaDataText}>
                    Person ID: {answer.personId}
                  </p>
                  <p className={styles.cardMetaDataText}>
                    {answer.isJunk ? "JUNK" : "Valid"}
                  </p>
                </div>
              </div>
            );
          })}
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

        {/* ボタン群 */}
        <div style={{ marginBottom: "var(--spacing-medium)", display: "flex", gap: "var(--spacing-small)" }}>
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
          <button
            type="button"
            onClick={handleAssignSameId}
            disabled={selectedPersonSnapshotIds.size === 0 || !selectedPersonSnapshotAnswerId}
            className={styles.primaryButton}
            style={{
              opacity: selectedPersonSnapshotIds.size === 0 || !selectedPersonSnapshotAnswerId ? 0.5 : 1,
              cursor: selectedPersonSnapshotIds.size === 0 || !selectedPersonSnapshotAnswerId ? "not-allowed" : "pointer"
            }}
          >
            同じIDを割り当て ({selectedPersonSnapshotIds.size}件選択中)
          </button>
          <button
            type="button"
            onClick={handleAssignJunk}
            disabled={selectedPersonSnapshotIds.size === 0}
            className={styles.primaryButton}
            style={{
              opacity: selectedPersonSnapshotIds.size === 0 ? 0.5 : 1,
              cursor: selectedPersonSnapshotIds.size === 0 ? "not-allowed" : "pointer"
            }}
          >
            ゴミデータを割り当て ({selectedPersonSnapshotIds.size}件選択中)
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
