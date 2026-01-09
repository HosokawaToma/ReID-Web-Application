import { ApiV1FrameImageSearch } from "@/lib/api/v1/frameImageSearch";
import { ApiV1FrameSearch } from "@/lib/api/v1/frameSearch";
import { timestampToString } from "@/lib/util/date";
import { FrameMetaData } from "@/types/frames";
import { useCallback, useState } from "react";

export interface FrameSearchProps {
  token: string | null;
}

export const useFrameSearch = ({ token }: FrameSearchProps) => {
  const [ids, setIds] = useState<string[] | null>(null);
  const [cameraIds, setCameraIds] = useState<number[] | null>(null);
  const [viewIds, setViewIds] = useState<number[] | null>(null);
  const [afterTimestamp, setAfterTimestamp] = useState<Date | null>(null);
  const [beforeTimestamp, setBeforeTimestamp] = useState<Date | null>(null);
  const [sortOrderByTimestamp, setSortOrderByTimestamp] = useState<"asc" | "desc">("desc");

  const [frames, setFrames] = useState<FrameMetaData[]>([]);
  const [frameImages, setFrameImages] = useState<Record<string, Blob | null>>({});

  const searchFrames = useCallback(async () => {
    if (!token) return;

    const response = await ApiV1FrameSearch(token, {
      filters: {
        ids: ids,
        camera_ids: cameraIds,
        view_ids: viewIds,
        timestamp_after: afterTimestamp ? timestampToString(afterTimestamp) : null,
        timestamp_before: beforeTimestamp ? timestampToString(beforeTimestamp) : null,
      },
      ordering: [sortOrderByTimestamp === "asc" ? "timestamp_asc" : "timestamp_desc"],
    });

    const baseFrames: FrameMetaData[] = response.frames.map((frame) => ({
      id: frame.id,
      cameraId: frame.camera_id,
      viewId: frame.view_id,
      timestamp: new Date(frame.timestamp),
    }));

    setFrames(baseFrames);
  }, [ids, afterTimestamp, beforeTimestamp, cameraIds, viewIds, sortOrderByTimestamp, token]);

  const searchFrameImage = useCallback(async (frameId: string) => {
    if (!token) return null;
    if (frameImages[frameId]) return frameImages[frameId];
    const response = await ApiV1FrameImageSearch(token, frameId);
    setFrameImages((prev) => ({ ...prev, [frameId]: response }));
    return response;
  }, [token, frameImages]);

  return {
    ids,
    cameraIds,
    viewIds,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    frames,
    frameImages,
    setIds,
    setCameraIds,
    setViewIds,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchFrames,
    searchFrameImage,
  };
};
