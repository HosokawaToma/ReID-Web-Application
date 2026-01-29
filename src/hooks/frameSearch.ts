import { ApiV1FrameImageSearch } from "@/lib/api/v1/frameImageSearch";
import { ApiV1FrameSearch } from "@/lib/api/v1/frameSearch";
import { timestampToString } from "@/lib/util/date";
import { FrameMetaData } from "@/types/frames";
import { useCallback, useRef, useState } from "react";

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
  const frameImagesRef = useRef<Record<string, Blob | null>>({});
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const searchFrames = useCallback(async () => {
    if (!token) return;

    const response = await ApiV1FrameSearch(token, {
      ids: ids,
      camera_ids: cameraIds,
      view_ids: viewIds,
      timestamp_after: afterTimestamp ? timestampToString(afterTimestamp) : null,
      timestamp_before: beforeTimestamp ? timestampToString(beforeTimestamp) : null,
      sort_by_list: [sortOrderByTimestamp === "asc" ? "timestamp_asc" : "timestamp_desc"],
      page: page,
    });

    const baseFrames: FrameMetaData[] = response.camera_frames.map((cameraFrame) => ({
      id: cameraFrame.id,
      cameraId: cameraFrame.camera_id,
      viewId: cameraFrame.view_id,
      timestamp: new Date(cameraFrame.timestamp),
    }));

    setTotalItems(response.pagination.total_items);
    setTotalPages(response.pagination.total_pages);

    setFrames(baseFrames);
  }, [ids, afterTimestamp, beforeTimestamp, cameraIds, viewIds, sortOrderByTimestamp, token, page]);

  const searchFrameImage = useCallback(async (frameId: string) => {
    if (!token) return null;
    if (frameImagesRef.current[frameId]) return frameImagesRef.current[frameId];
    const response = await ApiV1FrameImageSearch(token, frameId);
    frameImagesRef.current[frameId] = response;
    setFrameImages((prev) => ({ ...prev, [frameId]: response }));
    return response;
  }, [token]);

  return {
    ids,
    cameraIds,
    viewIds,
    afterTimestamp,
    beforeTimestamp,
    sortOrderByTimestamp,
    frames,
    frameImages,
    page,
    totalItems,
    totalPages,
    setIds,
    setCameraIds,
    setViewIds,
    setAfterTimestamp,
    setBeforeTimestamp,
    setSortOrderByTimestamp,
    searchFrames,
    searchFrameImage,
    setPage,
    setTotalItems,
    setTotalPages,
  };
};
