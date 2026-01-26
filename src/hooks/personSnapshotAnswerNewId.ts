import { useCallback, useState } from "react";
import { ApiV1PersonSnapshotAnswerNewId } from "@/lib/api/v1/personSnapshotAnswerNewId";

export const usePersonSnapshotAnswerNewId = (token: string | null) => {
  const [personSnapshotIds, setPersonSnapshotIds] = useState<string[]>([]);
  const [personId, setPersonId] = useState<string>("");
  const [isJunk, setIsJunk] = useState<boolean>(false);

  const newPersonSnapshotAnswerId = useCallback(async () => {
    if (!token) return;
    await ApiV1PersonSnapshotAnswerNewId(token, {
      person_snapshot_ids: personSnapshotIds,
      person_id: personId,
      is_junk: isJunk,
    });
  }, [token, personSnapshotIds, personId, isJunk]);
  return {
    personSnapshotIds,
    personId,
    isJunk,
    setPersonSnapshotIds,
    setPersonId,
    setIsJunk,
    newPersonSnapshotAnswerId,
  };
};
