"use client";

import { toDateInputString } from "@/lib/util/date";
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
  const handleAfterTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAfterTimestamp(new Date(e.target.value));
  };
  const handleBeforeTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeforeTimestamp(new Date(e.target.value));
  };
  const handleSortOrderByTimestampChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrderByTimestamp(e.target.value as "asc" | "desc");
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
    <div className={styles.defaultFormContainer}>
      <form onSubmit={handleSubmit} className={styles.defaultForm}>
        <div>
          <label htmlFor="id">ID</label>
          <input type="text" id="id" name="id" value={ids?.join(",") ?? ""} onChange={handleIdsChange}/>
        </div>
        <div>
          <label htmlFor="cameraId">Camera ID</label>
          <input type="text" id="cameraId" name="cameraId" value={cameraIds?.join(",") ?? ""} onChange={handleCameraIdsChange}/>
        </div>
        <div>
          <label htmlFor="viewId">View ID</label>
          <input type="text" id="viewId" name="viewId" value={viewIds?.join(",") ?? ""} onChange={handleViewIdsChange}/>
        </div>
        <div>
          <label htmlFor="afterTimestamp">After Timestamp</label>
          <input type="datetime-local" id="afterTimestamp" name="afterTimestamp" value={afterTimestamp ? toDateInputString(afterTimestamp) : ""} onChange={handleAfterTimestampChange}/>
        </div>
        <div>
          <label htmlFor="beforeTimestamp">Before Timestamp</label>
          <input type="datetime-local" id="beforeTimestamp" name="beforeTimestamp" value={beforeTimestamp ? toDateInputString(beforeTimestamp) : ""} onChange={handleBeforeTimestampChange}/>
        </div>
        <div>
          <label htmlFor="sortOrderByTimestamp">Sort Order By Timestamp</label>
          <select id="sortOrderByTimestamp" name="sortOrderByTimestamp" value={sortOrderByTimestamp} onChange={handleSortOrderByTimestampChange}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div>
          <button type="submit">Search</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}
