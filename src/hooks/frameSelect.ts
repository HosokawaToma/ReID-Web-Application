import { FrameMetaData } from "@/types/frames";
import { useCallback, useState } from "react";

export function useFrameSelect({ frameMetaDatas, frameImages }: { frameMetaDatas: FrameMetaData[], frameImages: Record<string, Blob | null> }) {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [selectedFrameMetaData, setSelectedFrameMetaData] = useState<FrameMetaData | null>(null);
  const [selectedFrameImage, setSelectedFrameImage] = useState<Blob | null>(null);
  const selectFrameById = useCallback((frameId: string) => {
    setSelectedFrameId(frameId);
    setSelectedFrameMetaData(frameMetaDatas.find((frame) => frame.id === frameId) ?? null);
    setSelectedFrameImage(frameImages[frameId] ?? null);
  }, [frameMetaDatas, frameImages]);

  return {
    selectedFrameId,
    selectedFrameMetaData,
    selectedFrameImage,
    selectFrameById,
  }
}
