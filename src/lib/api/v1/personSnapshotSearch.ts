export interface PersonSnapshotSearchResponse {
  person_snapshots: PersonSnapshot[];
}

export interface PersonSnapshot {
  id: string;
  image_id: string;
  person_id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export interface PersonSnapshotSearchRequest {
  filters: {
    ids: string[] | null;
    image_ids: string[] | null;
    camera_ids: number[] | null;
    view_ids: number[] | null;
    person_ids: string[] | null;
    after_timestamp: string | null;
    before_timestamp: string | null;
  };
  ordering: {
    timestamp_asc: boolean | null;
    timestamp_desc: boolean | null;
  };
}

export const ApiV1PersonSnapshotSearch = async (
  token: string | null,
  request: PersonSnapshotSearchRequest | null = null,
): Promise<PersonSnapshotSearchResponse> => {
  return await fetch(
    new Request(
      new URL("/api/v1/person/snapshot/search", process.env.NEXT_PUBLIC_API_URL as string),
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
