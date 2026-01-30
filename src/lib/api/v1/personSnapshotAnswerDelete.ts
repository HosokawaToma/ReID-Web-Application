export interface PersonSnapshotAnswerDeleteRequest {
  person_snapshot_id: string;
}

import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotAnswerDelete = async (
  token: string | null,
  request: PersonSnapshotAnswerDeleteRequest,
): Promise<void> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/answer/delete/${request.person_snapshot_id}`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
