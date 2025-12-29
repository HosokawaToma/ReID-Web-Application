"use client";

import { toDateInputString, toDateTime, toTimeInputString } from "@/lib/util/date";
import styles from "./search_form.module.css";

export interface PersonSnapshotSearchFromProps {
  personIds: string[] | null;
  cameraIds: number[] | null;
  viewIds: number[] | null;
  isJunk: boolean | null;
  afterTimestamp: Date | null;
  beforeTimestamp: Date | null;
  sortOrderByTimestamp: "asc" | "desc";
  setPersonIds: (personIds: string[] | null) => void;
  setCameraIds: (cameraIds: number[] | null) => void;
  setViewIds: (viewIds: number[] | null) => void;
  setIsJunk: (isJunk: boolean | null) => void;
  setAfterTimestamp: (afterTimestamp: Date | null) => void;
  setBeforeTimestamp: (beforeTimestamp: Date | null) => void;
  setSortOrderByTimestamp: (sortOrderByTimestamp: "asc" | "desc") => void;
  personIdsOption: string[];
  cameraIdsOption: number[];
  viewIdsOption: number[];
  onSubmitAction: () => void;
}

export default function PersonSnapshotSearchForm({
  personIds,
  cameraIds,
  viewIds,
  isJunk,
  afterTimestamp,
  beforeTimestamp,
  sortOrderByTimestamp,
  setPersonIds,
  setCameraIds,
  setViewIds,
  setIsJunk,
  setAfterTimestamp,
  setBeforeTimestamp,
  setSortOrderByTimestamp,
  personIdsOption,
  cameraIdsOption,
  viewIdsOption,
  onSubmitAction,
}: PersonSnapshotSearchFromProps) {
  const handlePersonIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonIds(e.target.value.split(","));
  };

  const handleCameraIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraIds(e.target.value.split(",").map(Number));
  };

  const handleViewIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewIds(e.target.value.split(",").map(Number));
  };

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

  const handleSortOrderByTimestampChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrderByTimestamp(e.target.value as "asc" | "desc");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitAction();
  };

  const handleReset = () => {
    setPersonIds(null);
    setCameraIds(null);
    setViewIds(null);
    setIsJunk(null);
    setAfterTimestamp(null);
    setBeforeTimestamp(null);
    setSortOrderByTimestamp("desc");
  };

  const isNoJunk = isJunk === false;
  const isAllJunk = isJunk === null;
  const isJunkOnly = isJunk === true;

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <label htmlFor="personId" className={styles.label}>
          Person ID
        </label>
        <input
          id="personId"
          type="text"
          list="personIdsOption"
          value={personIds?.join(",") ?? ""}
          onChange={handlePersonIdsChange}
          placeholder="例: person_123"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
        <datalist id="personIdsOption">
          {personIdsOption.map((personId) => (
            <option key={personId} value={personId}>
              {personId}
            </option>
          ))}
        </datalist>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cameraId" className={styles.label}>
          Camera ID
        </label>
        <input
          id="cameraId"
          type="text"
          list="cameraIdsOption"
          value={cameraIds?.join(",") ?? ""}
          onChange={handleCameraIdsChange}
          placeholder="例: 1"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
        <datalist id="cameraIdsOption">
          {cameraIdsOption.map((cameraId) => (
            <option key={cameraId} value={cameraId}>
              {cameraId}
            </option>
          ))}
        </datalist>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="viewId" className={styles.label}>
          View ID
        </label>
        <input
          id="viewId"
          type="text"
          list="viewIdsOption"
          value={viewIds?.join(",") ?? ""}
          onChange={handleViewIdsChange}
          placeholder="例: 1"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
        <datalist id="viewIdsOption">
          {viewIdsOption.map((viewId) => (
            <option key={viewId} value={viewId}>
              {viewId}
            </option>
          ))}
        </datalist>
      </div>

      <div className={styles.formGroup}>
        <span className={styles.label}>Junkデータの扱い</span>
        <div className={styles.junkSegmented} role="group" aria-label="Junkデータの扱い">
          <button
            type="button"
            className={`${styles.junkSegmentedButton} ${
              isAllJunk ? styles.junkSegmentedButtonActive : ""
            }`}
            aria-pressed={isAllJunk}
            onClick={() => setIsJunk(null)}>
            すべて
          </button>
          <button
            type="button"
            className={`${styles.junkSegmentedButton} ${
              isNoJunk ? styles.junkSegmentedButtonActive : ""
            }`}
            aria-pressed={isNoJunk}
            onClick={() => setIsJunk(false)}>
            除外
          </button>
          <button
            type="button"
            className={`${styles.junkSegmentedButton} ${
              isJunkOnly ? styles.junkSegmentedButtonActive : ""
            }`}
            aria-pressed={isJunkOnly}
            onClick={() => setIsJunk(true)}>
            Junkのみ
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date" className={styles.label}>
          日付
        </label>
        <input
          id="date"
          type="date"
          value={afterTimestamp ? toDateInputString(afterTimestamp) : ""}
          onChange={handleDateChange}
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="afterTime" className={styles.label}>
          開始時刻
        </label>
        <input
          id="afterTime"
          type="time"
          value={afterTimestamp ? toTimeInputString(afterTimestamp) : ""}
          onChange={handleAfterTimeChange}
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="beforeTime" className={styles.label}>
          終了時刻
        </label>
        <input
          id="beforeTime"
          type="time"
          value={beforeTimestamp ? toTimeInputString(beforeTimestamp) : ""}
          onChange={handleBeforeTimeChange}
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="sortOrderByTimestamp" className={styles.label}>
          ソート順 (日時)
        </label>
        <select
          id="sortOrderByTimestamp"
          value={sortOrderByTimestamp}
          onChange={handleSortOrderByTimestampChange}
          className={`${styles.defaultInput} ${styles.fullWidthInput} ${styles.select}`}>
          <option value="desc">新しい順 (降順)</option>
          <option value="asc">古い順 (昇順)</option>
        </select>
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={`${styles.defaultButton} ${styles.fullWidthButton}`}>
          検索
        </button>
        <button
          type="button"
          className={`${styles.defaultButton} ${styles.fullWidthButton} ${styles.resetButton}`}
          onClick={handleReset}>
          条件をリセット
        </button>
      </div>
    </form>
  );
}
