import { ApiV1PersonSnapshotImageSearch } from "@/lib/api/v1/personSnapshotImageSearch";
import { ApiV1PersonSnapshotSearch } from "@/lib/api/v1/personSnapshotSearch";
import { timestampToString } from "@/lib/util/date";
import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import { useCallback, useRef, useState } from "react";

export const usePersonSnapshotSearch = (token: string | null) => {
  const [personIds, setPersonIds] = useState<string[] | null>(null);
  const [cameraIds, setCameraIds] = useState<number[] | null>(null);
  const [viewIds, setViewIds] = useState<number[] | null>(null);
  const [isJunk, setIsJunk] = useState<boolean | null>(null);
  const [afterTimestamp, setAfterTimestamp] = useState<Date | null>(null);
  const [beforeTimestamp, setBeforeTimestamp] = useState<Date | null>(null);
  const [sortOrderByTimestamp, setSortOrderByTimestamp] = useState<"asc" | "desc">("asc");

  const [personSnapshots, setPersonSnapshots] = useState<PersonSnapshotMetaData[]>([]);
  const [personSnapshotImages, setPersonSnapshotImages] = useState<Record<string, Blob | null>>({});
  const personSnapshotImagesRef = useRef<Record<string, Blob | null>>({});

  const addPersonId = (personId: string) => {
    setPersonIds([...(personIds ?? []), personId]);
  };

  const searchPersonSnapshots = useCallback(async () => {
    if (!token) return;

    const response = await ApiV1PersonSnapshotSearch(token, {
      ids: null,
      camera_ids: cameraIds,
      view_ids: viewIds,
      person_ids: personIds,
      is_junk: isJunk,
      timestamp_after: afterTimestamp ? timestampToString(afterTimestamp) : null,
      timestamp_before: beforeTimestamp ? timestampToString(beforeTimestamp) : null,
      sort_by_list: [sortOrderByTimestamp === "asc" ? "timestamp_asc" : "timestamp_desc"],
    });

    const baseSnapshots: PersonSnapshotMetaData[] = response.person_snapshots.map(
      (personSnapshot) => ({
        id: personSnapshot.id,
        cameraId: personSnapshot.camera_id,
        viewId: personSnapshot.view_id,
        timestamp: new Date(personSnapshot.timestamp),
        isJunk: personSnapshot.is_junk,
        personId: personSnapshot.person_id,
      })
    );

    setPersonSnapshots(baseSnapshots);
  }, [
    afterTimestamp,
    beforeTimestamp,
    cameraIds,
    isJunk,
    personIds,
    sortOrderByTimestamp,
    token,
    viewIds,
  ]);

  const searchPersonSnapshotImage = useCallback(
    async (personSnapshotId: string) => {
      if (!token) return null;
      if (personSnapshotImagesRef.current[personSnapshotId]) {
        return personSnapshotImagesRef.current[personSnapshotId];
      }
      const response = await ApiV1PersonSnapshotImageSearch(token, personSnapshotId);
      personSnapshotImagesRef.current[personSnapshotId] = response;
      setPersonSnapshotImages((prev) => ({ ...prev, [personSnapshotId]: response }));
      return response;
    },
    [token]
  );

  return {
    personIds,
    cameraIds,
    viewIds,
    isJunk,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    personSnapshots,
    personSnapshotImages,
    setPersonIds,
    setCameraIds,
    setViewIds,
    setIsJunk,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchPersonSnapshots,
    searchPersonSnapshotImage,
    addPersonId,
  };
};
