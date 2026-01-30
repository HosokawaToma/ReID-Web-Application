export interface PersonSnapshotAnswerSearchResponse {
  person_snapshot_answers: PersonSnapshotAnswer[];
}

export interface PersonSnapshotAnswer {
  id: string;
  is_junk: boolean;
  person_id: string | null;
}

export interface PersonSnapshotAnswerSearchRequest {
  person_snapshot_ids: string[] | null;
  person_ids: string[] | null;
  is_junk: boolean | null;
  sort_by_list: ("created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc")[] | null;
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotAnswerSearch = async (
  token: string | null,
  request: PersonSnapshotAnswerSearchRequest | null = null,
): Promise<PersonSnapshotAnswerSearchResponse> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/answer/search`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  return await fetchWithTokenRefresh(requestObj, token)
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error("Unauthorized");
      }
      return await response.json();
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
