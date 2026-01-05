import { Frame } from "@/types/frames";
import { useState } from "react";

export default function useFrameSelect() {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  return {
    selectedFrame,
    setSelectedFrame,
  }
}
