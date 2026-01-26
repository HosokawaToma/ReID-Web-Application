export interface PersonSnapshotAnswerNewIdRequest {
  person_snapshot_ids: string[];
  person_id: string | null;
  is_junk: boolean;
}

export const ApiV1PersonSnapshotAnswerNewId = async (
  token: string | null,
  request: PersonSnapshotAnswerNewIdRequest,
): Promise<void> => {
  return await fetch(
    new Request(
      new URL("/api/v1/person/snapshot/answer/new_id", process.env.NEXT_PUBLIC_API_URL as string),
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
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
