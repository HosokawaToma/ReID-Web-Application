import { ApiV1FrameImageSearch } from "@/lib/api/v1/frameImageSearch";
import { ApiV1FrameSearch } from "@/lib/api/v1/frameSearch";
import { Frame } from "@/types/frames";
import { useCallback, useRef, useState } from "react";

export const useFrameSearch = (token: string | null) => {
  const [ids, setIds] = useState<string[] | null>(null);
  const [cameraIds, setCameraIds] = useState<number[] | null>(null);
  const [viewIds, setViewIds] = useState<number[] | null>(null);
  const [afterTimestamp, setAfterTimestamp] = useState<Date | null>(null);
  const [beforeTimestamp, setBeforeTimestamp] = useState<Date | null>(null);
  const [sortOrderByTimestamp, setSortOrderByTimestamp] = useState<"asc" | "desc">("desc");

  const [frames, setFrames] = useState<Frame[]>([]);
  const activeSearchIdRef = useRef(0);

  const searchFrames = useCallback(async () => {
    if (!token) return;
    const searchId = ++activeSearchIdRef.current;

    const response = await ApiV1FrameSearch(token, {
      filters: {
        ids: ids,
        camera_ids: cameraIds,
        view_ids: viewIds,
        timestamp_after: afterTimestamp?.toISOString() ?? null,
        timestamp_before: beforeTimestamp?.toISOString() ?? null,
      },
      ordering: [sortOrderByTimestamp === "asc" ? "timestamp_asc" : "timestamp_desc"],
    });

    const baseFrames: Frame[] = response.frames.map((frame) => ({
      id: frame.id,
      cameraId: frame.camera_id,
      viewId: frame.view_id,
      timestamp: new Date(frame.timestamp),
      imageBlob: null,
    }));

    if (searchId !== activeSearchIdRef.current) return;
    setFrames(baseFrames);

    await Promise.allSettled(
      baseFrames.map(async (frame) => {
        try {
          const imageBlob = await ApiV1FrameImageSearch(token, frame.id);
          if (searchId !== activeSearchIdRef.current) return;
          setFrames((prev) =>
            prev.map((f) => (f.id === frame.id ? { ...f, imageBlob } : f))
          );
        } catch {
          // 画像取得失敗時はそのままにしておく
        }
      })
    );
  }, [
    ids,
    afterTimestamp,
    beforeTimestamp,
    cameraIds,
    viewIds,
    sortOrderByTimestamp,
    token,
  ]);
  return {
    ids,
    cameraIds,
    viewIds,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    frames,
    setIds,
    setCameraIds,
    setViewIds,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchFrames,
  };
};
