"use client";

import { toDateInputString, toDateTime, toTimeInputString } from "@/lib/util/date";
import styles from "../styles/index.module.css";

export interface FrameSearchFormProps {
  ids: string[] | null;
  cameraIds: number[] | null;
  viewIds: number[] | null;
  afterTimestamp: Date | null;
  beforeTimestamp: Date | null;
  sortOrderByTimestamp: "asc" | "desc";
  setIds: (ids: string[] | null) => void;
  setCameraIds: (cameraIds: number[] | null) => void;
  setViewIds: (viewIds: number[] | null) => void;
  setAfterTimestamp: (afterTimestamp: Date | null) => void;
  setBeforeTimestamp: (beforeTimestamp: Date | null) => void;
  setSortOrderByTimestamp: (sortOrderByTimestamp: "asc" | "desc") => void;
  onSubmitAction: () => void;
}

export default function FrameSearchForm({
  ids,
  cameraIds,
  viewIds,
  afterTimestamp,
  beforeTimestamp,
  sortOrderByTimestamp,
  setIds,
  setCameraIds,
  setViewIds,
  setAfterTimestamp,
  setBeforeTimestamp,
  setSortOrderByTimestamp,
  onSubmitAction,
}: FrameSearchFormProps) {
  const handleIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIds(e.target.value.split(","));
  };
  const handleCameraIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraIds(e.target.value.split(",").map(Number));
  };
  const handleViewIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewIds(e.target.value.split(",").map(Number));
  };
  const handleSortOrderByTimestampChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrderByTimestamp(e.target.value as "asc" | "desc");
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
    const date = beforeTimestamp ? toDateInputString(beforeTimestamp) : toDateInputString(new Date());
    const afterTime = afterTimestamp ? toTimeInputString(afterTimestamp) : "00:00:00";
    setBeforeTimestamp(toDateTime(date, e.target.value));
    setAfterTimestamp(toDateTime(date, afterTime));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitAction();
  };
  const handleReset = () => {
    setIds(null);
    setCameraIds(null);
    setViewIds(null);
    setAfterTimestamp(null);
    setBeforeTimestamp(null);
    setSortOrderByTimestamp("desc");
  };
  return (
    <form onSubmit={handleSubmit} className={styles.defaultForm}>
      <div className={styles.defaultFormContainer}>
        <div className={styles.threeColumnGrid}>
          <div>
            <label htmlFor="id">ID</label>
            <input type="text" id="id" name="id" className={styles.defaultInput} value={ids?.join(",") ?? ""} onChange={handleIdsChange}/>
          </div>
          <div>
            <label htmlFor="cameraId">Camera ID</label>
            <input type="text" id="cameraId" name="cameraId" className={styles.defaultInput} value={cameraIds?.join(",") ?? ""} onChange={handleCameraIdsChange}/>
          </div>
          <div>
            <label htmlFor="viewId">View ID</label>
            <input type="text" id="viewId" name="viewId" className={styles.defaultInput} value={viewIds?.join(",") ?? ""} onChange={handleViewIdsChange}/>
          </div>
          <div>
            <label htmlFor="Date">Date</label>
            <input type="date" id="date" name="date" className={styles.defaultInput} value={afterTimestamp ? toDateInputString(afterTimestamp) : ""} onChange={handleDateChange}/>
          </div>
          <div>
            <label htmlFor="afterTime">After Time</label>
            <input type="time" id="afterTime" name="afterTime" step="1" className={styles.defaultInput} value={afterTimestamp ? toTimeInputString(afterTimestamp) : ""} onChange={handleAfterTimeChange}/>
          </div>
          <div>
            <label htmlFor="beforeTime">Before Time</label>
            <input type="time" id="beforeTime" name="beforeTime" step="1" className={styles.defaultInput} value={beforeTimestamp ? toTimeInputString(beforeTimestamp) : ""} onChange={handleBeforeTimeChange}/>
          </div>
          <div>
            <label htmlFor="sortOrderByTimestamp">Sort Order By Timestamp</label>
            <select id="sortOrderByTimestamp" name="sortOrderByTimestamp" className={styles.defaultInput} value={sortOrderByTimestamp} onChange={handleSortOrderByTimestampChange}>
            <option value="desc">新しい順 (降順)</option>
            <option value="asc">古い順 (昇順)</option>
          </select>
        </div>
        </div>
        <div className={styles.twoColumnGrid}>
          <button type="submit" className={styles.primaryButton}>Search</button>
          <button type="button" onClick={handleReset} className={styles.defaultButton}>Reset</button>
        </div>
      </div>
    </form>
  );
}
