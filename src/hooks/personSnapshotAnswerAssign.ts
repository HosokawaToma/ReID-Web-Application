import { ApiV1PersonSnapshotAnswerAssign } from "@/lib/api/v1/personSnapshotAnswerAssign";
import { useCallback, useState } from "react";

export const usePersonSnapshotAnswerAssign = (token: string | null) => {
  const [sourcePersonSnapshotId, setSourcePersonSnapshotId] = useState<string>("");
  const [targetPersonSnapshotIds, setTargetPersonSnapshotIds] = useState<string[]>([]);

  const assignPersonSnapshotAnswer = useCallback(async () => {
    if (!token || !sourcePersonSnapshotId || targetPersonSnapshotIds.length === 0) return;

    await ApiV1PersonSnapshotAnswerAssign(token, {
      source_person_snapshot_id: sourcePersonSnapshotId,
      target_person_snapshot_ids: targetPersonSnapshotIds,
    });
  }, [token, sourcePersonSnapshotId, targetPersonSnapshotIds]);

  return {
    sourcePersonSnapshotId,
    targetPersonSnapshotIds,
    setSourcePersonSnapshotId,
    setTargetPersonSnapshotIds,
    assignPersonSnapshotAnswer,
  };
};
