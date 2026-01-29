export interface FrameSearchResponse {
  camera_frames: CameraFrameSearchResponseItem[];
  pagination: Pagination;
}

export interface Pagination {
  total_items: number;
  total_pages: number;
}

export interface CameraFrameSearchResponseItem {
  id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export interface FrameSearchRequest {
  ids: string[] | null;
  camera_ids: number[] | null;
  view_ids: number[] | null;
  timestamp_after: string | null;
  timestamp_before: string | null;
  sort_by_list: ("timestamp_asc" | "timestamp_desc")[];
  page: number;
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1FrameSearch = async (
  token: string | null,
  request: FrameSearchRequest | null = null
): Promise<FrameSearchResponse> => {
  console.log(request);
  const requestObj = new Request(
    new URL(`/api/v1/frame/search/${request?.page}`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: request?.ids || null,
        camera_ids: request?.camera_ids || null,
        view_ids: request?.view_ids || null,
        timestamp_after: request?.timestamp_after || null,
        timestamp_before: request?.timestamp_before || null,
        sort_by_list: request?.sort_by_list || null,
      }),
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
