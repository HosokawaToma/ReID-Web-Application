export interface IdentifyPersonSearchResponse {
  image_id: string;
  person_id: string;
  camera_id: number;
  view_id: number;
  timestamp: string;
}

export const ApiV1IdentifyPersonSearch = async (
  token: string | null
): Promise<IdentifyPersonSearchResponse[]> => {
  return await fetch(
    new Request(
      new URL("/api/v1/identify_person/search", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          after: null,
          before: null,
          camera_ids: null,
          view_ids: null,
          person_ids: null,
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
