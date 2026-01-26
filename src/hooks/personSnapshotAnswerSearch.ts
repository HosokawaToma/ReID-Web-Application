import { ApiV1PersonSnapshotAnswerSearch } from "@/lib/api/v1/personSnapshotAnswerSearch";
import { PersonSnapshotAnswer } from "@/types/personSnapshots";
import { useCallback, useState } from "react";

export const usePersonSnapshotAnswerSearch = (token: string | null) => {
  const [personSnapshotIds, setPersonSnapshotIds] = useState<string[] | null>(null);
  const [personIds, setPersonIds] = useState<string[] | null>(null);
  const [isJunk, setIsJunk] = useState<boolean | null>(null);
  const [sortOrderByTimestamp, setSortOrderByTimestamp] = useState<"asc" | "desc">("desc");

  const [personSnapshotAnswers, setPersonSnapshotAnswers] = useState<PersonSnapshotAnswer[]>([]);
  const searchPersonSnapshotAnswers = useCallback(async () => {
    if (!token) return;
    const response = await ApiV1PersonSnapshotAnswerSearch(token, {
      person_snapshot_ids: personSnapshotIds,
      person_ids: personIds,
      is_junk: isJunk,
      sort_by_list: [sortOrderByTimestamp === "asc" ? "created_at_asc" : "created_at_desc"],
    });
    setPersonSnapshotAnswers(response.person_snapshot_answers.map((answer) => ({
      id: answer.id,
      personId: answer.person_id,
      isJunk: answer.is_junk,
    })));
  }, [token, personSnapshotIds, personIds, isJunk, sortOrderByTimestamp]);

  return {
    personSnapshotIds,
    personIds,
    isJunk,
    sortOrderByTimestamp,
    personSnapshotAnswers,
    setPersonSnapshotIds,
    setPersonIds,
    setIsJunk,
    setSortOrderByTimestamp,
    searchPersonSnapshotAnswers,
  };
};
