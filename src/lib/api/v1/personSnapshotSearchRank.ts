export interface PersonSnapshotSearchRankRequest {
  person_snapshot_id: string;
  page: number;
}

export interface PersonSnapshotSearchRankResponse {
  person_snapshots: PersonSnapshot[];
  pagination: Pagination;
}

export interface Pagination {
  total_items: number;
  total_pages: number;
}

export interface PersonSnapshot {
  id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
  is_junk: boolean;
  person_id: string | null;
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotSearchRank = async (
  token: string | null,
  request: PersonSnapshotSearchRankRequest
): Promise<PersonSnapshotSearchRankResponse> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/search/rank/${request.person_snapshot_id}/${request.page}`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
  );

  return await fetchWithTokenRefresh(requestObj, token)
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error("Unauthorized");
      }
      const data = await response.json();
      console.log(data);
      return data;
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
