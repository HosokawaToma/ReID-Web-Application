export interface PersonSnapshotAnswerSearchResponse {
  person_snapshot_answers: PersonSnapshotAnswer[];
}

export interface PersonSnapshotAnswer {
  id: string;
  person_id: string;
  is_junk: boolean;
}

export interface PersonSnapshotAnswerSearchRequest {
  person_ids: string[];
  is_junk: boolean | null;
  sort_by_list: ("created_at_asc" | "created_at_desc")[];
}

export const ApiV1PersonSnapshotAnswerSearch = async (
  token: string | null,
  request: PersonSnapshotAnswerSearchRequest | null = null,
): Promise<PersonSnapshotAnswerSearchResponse> => {
  return await fetch(
    new Request(
      new URL("/api/v1/person/snapshot/answer/search", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    )
  )
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error("Unauthorized");
      }
      const data = await response.json();
      return data;
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
