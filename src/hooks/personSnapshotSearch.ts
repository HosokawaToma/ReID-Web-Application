import { ApiV1PersonSnapshotImageSearch } from "@/lib/api/v1/personSnapshotImageSearch";
import { ApiV1PersonSnapshotSearch } from "@/lib/api/v1/personSnapshotSearch";
import { PersonSnapshot } from "@/types/personSnapshots";
import { useCallback, useRef, useState } from "react";

export const usePersonSnapshotSearch = (token: string | null) => {
  const [personIds, setPersonIds] = useState<string[] | null>(null);
  const [cameraIds, setCameraIds] = useState<number[] | null>(null);
  const [viewIds, setViewIds] = useState<number[] | null>(null);
  const [isJunk, setIsJunk] = useState<boolean | null>(null);
  const [afterTimestamp, setAfterTimestamp] = useState<Date | null>(null);
  const [beforeTimestamp, setBeforeTimestamp] = useState<Date | null>(null);
  const [sortOrderByTimestamp, setSortOrderByTimestamp] = useState<"asc" | "desc">("desc");

  const [personSnapshots, setPersonSnapshots] = useState<PersonSnapshot[]>([]);
  const activeSearchIdRef = useRef(0);

  const addPersonId = (personId: string) => {
    setPersonIds([...(personIds ?? []), personId]);
  };

  const searchPersonSnapshots = useCallback(async () => {
    if (!token) return;
    const searchId = ++activeSearchIdRef.current;

    const response = await ApiV1PersonSnapshotSearch(token, {
      filters: {
        ids: null,
        camera_ids: cameraIds,
        view_ids: viewIds,
        person_ids: personIds,
        is_junk: isJunk,
        timestamp_after: afterTimestamp?.toISOString() ?? null,
        timestamp_before: beforeTimestamp?.toISOString() ?? null,
      },
      ordering: {
        timestamp_asc: sortOrderByTimestamp === "asc",
        timestamp_desc: sortOrderByTimestamp === "desc",
      },
    });

    const baseSnapshots: PersonSnapshot[] = response.person_snapshots.map((personSnapshot) => ({
      id: personSnapshot.id,
      cameraId: personSnapshot.camera_id,
      viewId: personSnapshot.view_id,
      timestamp: new Date(personSnapshot.timestamp),
      isJunk: personSnapshot.is_junk,
      personId: personSnapshot.person_id,
      imageBlob: null,
    }));

    if (searchId !== activeSearchIdRef.current) return;
    setPersonSnapshots(baseSnapshots);

    await Promise.allSettled(
      baseSnapshots.map(async (snapshot) => {
        try {
          const imageBlob = await ApiV1PersonSnapshotImageSearch(token, snapshot.id);
          if (searchId !== activeSearchIdRef.current) return;
          setPersonSnapshots((prev) =>
            prev.map((p) => (p.id === snapshot.id ? { ...p, imageBlob } : p))
          );
        } catch {
          // 画像取得失敗時はそのままにしておく
        }
      })
    );
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
  return {
    personIds,
    cameraIds,
    viewIds,
    isJunk,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    personSnapshots,
    setPersonIds,
    setCameraIds,
    setViewIds,
    setIsJunk,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchPersonSnapshots,
    addPersonId,
  };
};
