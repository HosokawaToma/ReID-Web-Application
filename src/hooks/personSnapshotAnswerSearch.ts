import { ApiV1PersonSnapshotAnswerSearch, PersonSnapshotAnswer } from "@/lib/api/v1/personSnapshotAnswerSearch";
import { useCallback, useState } from "react";

export const usePersonSnapshotAnswerSearch = (token: string | null) => {
  const [personIds, setPersonIds] = useState<string[] | null>(null);
  const [personSnapshotIds, setPersonSnapshotIds] = useState<string[] | null>(null);
  const [isJunk, setIsJunk] = useState<boolean | null>(null);
  const [personAnswers, setPersonAnswers] = useState<PersonSnapshotAnswer[]>([]);

  const searchPersonAnswers = useCallback(async () => {
    if (!token) return;

    const response = await ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: personSnapshotIds,
      person_ids: personIds,
      is_junk: isJunk,
      sort_by_list: ["created_at_desc"],
    });

    setPersonAnswers(response.person_snapshot_answers);
  }, [
    isJunk,
    personIds,
    personSnapshotIds,
    token,
  ]);

  return {
    personIds,
    personSnapshotIds,
    isJunk,
    personAnswers,
    setPersonIds,
    setPersonSnapshotIds,
    setIsJunk,
    searchPersonAnswers,
  };
};
