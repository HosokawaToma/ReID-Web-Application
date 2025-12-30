export interface FrameSearchResponse {
  frames: FrameSearchResponseItem[];
}

export interface FrameSearchResponseItem {
  id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export interface FrameSearchRequest {
  filters: {
    ids: string[] | null;
    camera_ids: number[] | null;
    view_ids: number[] | null;
    timestamp_after: string | null;
    timestamp_before: string | null;
  };
  ordering: {
    timestamp_asc: boolean | null;
    timestamp_desc: boolean | null;
  };
}

export const ApiV1FrameSearch = async (
  token: string | null,
  request: FrameSearchRequest | null = null
): Promise<FrameSearchResponse> => {
  return await fetch(
    new Request(
      new URL("/api/v1/frame/search", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: request?.filters || null,
          ordering: request?.ordering || null,
        }),
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
