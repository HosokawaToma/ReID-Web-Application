export interface PersonSnapshotSearchRankRequest {
  person_snapshot_id: string;
  limit: number;
}

export interface PersonSnapshotSearchRankResponse {
  person_snapshots: PersonSnapshot[];
}

export interface PersonSnapshot {
  id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
  is_junk: boolean;
  person_id: string | null;
}

export const ApiV1PersonSnapshotSearchRank = async (
  token: string | null,
  request: PersonSnapshotSearchRankRequest
): Promise<PersonSnapshotSearchRankResponse> => {
  return await fetch(
    new Request(
      new URL("/api/v1/person/snapshot/search/rank", process.env.NEXT_PUBLIC_API_URL as string),
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
