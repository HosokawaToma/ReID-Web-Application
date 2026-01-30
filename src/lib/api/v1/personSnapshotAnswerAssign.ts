export interface PersonSnapshotAnswerAssignRequest {
  source_person_snapshot_id: string;
  target_person_snapshot_ids: string[];
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotAnswerAssign = async (
  token: string | null,
  request: PersonSnapshotAnswerAssignRequest,
): Promise<void> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/answer/assign`, process.env.NEXT_PUBLIC_API_URL as string),
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
      return;
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
