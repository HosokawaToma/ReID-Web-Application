export interface PersonSnapshotSearchResponse {
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

export interface PersonSnapshotSearchRequest {
  ids: string[] | null;
  camera_ids: number[] | null;
  view_ids: number[] | null;
  is_junk: boolean | null;
  person_ids: string[] | null;
  timestamp_after: string | null;
  timestamp_before: string | null;
  sort_by_list: ("timestamp_asc" | "timestamp_desc")[];
  page: number;
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotSearch = async (
  token: string | null,
  request: PersonSnapshotSearchRequest | null = null,
): Promise<PersonSnapshotSearchResponse> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/search/${request?.page ?? 1}`, process.env.NEXT_PUBLIC_API_URL as string),
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
      const data = await response.json();
      return data;
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
