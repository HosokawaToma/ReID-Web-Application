import { ApiV1PersonSnapshotImageSearch } from "@/lib/api/v1/personSnapshotImageSearch";
import { ApiV1PersonSnapshotSearchRank } from "@/lib/api/v1/personSnapshotSearchRank";
import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import { useCallback, useRef, useState } from "react";

export const usePersonSnapshotSearchRank = (token: string | null) => {
  const [personSnapshotId, setPersonSnapshotId] = useState<string>("");
  const [limit, setLimit] = useState<number>(1000);

  const [personSnapshots, setPersonSnapshots] = useState<PersonSnapshotMetaData[]>([]);
  const [personSnapshotImages, setPersonSnapshotImages] = useState<Record<string, Blob | null>>({});
  const personSnapshotImagesRef = useRef<Record<string, Blob | null>>({});

  const searchPersonSnapshotRank = useCallback(async () => {
    if (!token || !personSnapshotId) return;

    const response = await ApiV1PersonSnapshotSearchRank(token, {
      person_snapshot_id: personSnapshotId,
      limit: limit,
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
  }, [personSnapshotId, limit, token]);

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
    personSnapshotId,
    limit,
    personSnapshots,
    personSnapshotImages,
    setPersonSnapshotId,
    setLimit,
    searchPersonSnapshotRank,
    searchPersonSnapshotImage,
  };
};
