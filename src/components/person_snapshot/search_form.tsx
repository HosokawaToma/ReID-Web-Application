"use client";

import { PersonSnapshotSearchRequest } from "@/lib/api/v1/personSnapshotSearch";
import { useState } from "react";
import styles from "./search_form.module.css";

interface PersonSnapshotSearchFormProps {
  onSearch: (request: PersonSnapshotSearchRequest) => void;
}

export default function PersonSnapshotSearchForm({ onSearch }: PersonSnapshotSearchFormProps) {
  const [personId, setPersonId] = useState<string>("");
  const [cameraId, setCameraId] = useState<string>("");
  const [viewId, setViewId] = useState<string>("");
  const [afterTimestamp, setAfterTimestamp] = useState<string>("");
  const [beforeTimestamp, setBeforeTimestamp] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: PersonSnapshotSearchRequest = {
      filters: {
        ids: null,
        image_ids: null,
        camera_ids: cameraId !== "" ? [parseInt(cameraId)] : null,
        view_ids: viewId !== "" ? [parseInt(viewId)] : null,
        person_ids: personId !== "" ? [personId] : null,
        after_timestamp: afterTimestamp !== "" ? new Date(afterTimestamp).toISOString() : null,
        before_timestamp: beforeTimestamp !== "" ? new Date(beforeTimestamp).toISOString() : null,
      },
      ordering: {
        timestamp_asc: sortOrder === "asc" ? true : null,
        timestamp_desc: sortOrder === "desc" ? true : null,
      },
    };

    onSearch(request);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.formGroup}>
        <label htmlFor="personId" className={styles.label}>
          Person ID
        </label>
        <input
          id="personId"
          type="text"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          placeholder="例: person_123"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cameraId" className={styles.label}>
          Camera ID
        </label>
        <input
          id="cameraId"
          type="number"
          value={cameraId}
          onChange={(e) => setCameraId(e.target.value)}
          placeholder="例: 1"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="viewId" className={styles.label}>
          View ID
        </label>
        <input
          id="viewId"
          type="number"
          value={viewId}
          onChange={(e) => setViewId(e.target.value)}
          placeholder="例: 1"
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="afterTimestamp" className={styles.label}>
          開始日時
        </label>
        <input
          id="afterTimestamp"
          type="datetime-local"
          value={afterTimestamp}
          onChange={(e) => setAfterTimestamp(e.target.value)}
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="beforeTimestamp" className={styles.label}>
          終了日時
        </label>
        <input
          id="beforeTimestamp"
          type="datetime-local"
          value={beforeTimestamp}
          onChange={(e) => setBeforeTimestamp(e.target.value)}
          className={`${styles.defaultInput} ${styles.fullWidthInput}`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="sortOrder" className={styles.label}>
          ソート順 (日時)
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className={`${styles.defaultInput} ${styles.fullWidthInput} ${styles.select}`}>
          <option value="desc">新しい順 (降順)</option>
          <option value="asc">古い順 (昇順)</option>
        </select>
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={`${styles.defaultButton} ${styles.fullWidthButton}`}>
          検索条件を適用
        </button>
      </div>
    </form>
  );
}
