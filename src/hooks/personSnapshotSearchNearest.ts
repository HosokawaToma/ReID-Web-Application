import { ApiV1PersonSnapshotImageSearch } from "@/lib/api/v1/personSnapshotImageSearch";
import { ApiV1PersonSnapshotSearchNearest } from "@/lib/api/v1/personSnapshotSearchNearest";
import { PersonSnapshotMetaData } from "@/types/personSnapshots";
import { useCallback, useEffect, useRef, useState } from "react";

export const usePersonSnapshotSearchNearest = (token: string | null) => {
  const [personSnapshotId, setPersonSnapshotId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [personSnapshots, setPersonSnapshots] = useState<PersonSnapshotMetaData[]>([]);
  const [personSnapshotImages, setPersonSnapshotImages] = useState<Record<string, Blob | null>>({});
  const personSnapshotImagesRef = useRef<Record<string, Blob | null>>({});

  const searchPersonSnapshotNearest = useCallback(async () => {
    if (!token || !personSnapshotId) return;

    const response = await ApiV1PersonSnapshotSearchNearest(token, {
      person_snapshot_id: personSnapshotId,
      page: page,
    });

    setTotalItems(response.pagination.total_items);
    setTotalPages(response.pagination.total_pages);

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
  }, [personSnapshotId, page, token]);

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

  useEffect(() => {
    if (!token || !personSnapshotId) return;

    const performSearch = async () => {
      const response = await ApiV1PersonSnapshotSearchNearest(token, {
        person_snapshot_id: personSnapshotId,
        page: page,
      });

      setTotalItems(response.pagination.total_items);
      setTotalPages(response.pagination.total_pages);

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
    };

    performSearch();
  }, [page, token, personSnapshotId]);

  return {
    personSnapshotId,
    page,
    totalItems,
    totalPages,
    personSnapshots,
    personSnapshotImages,
    setPersonSnapshotId,
    setPage,
    searchPersonSnapshotNearest,
    searchPersonSnapshotImage,
  };
};
