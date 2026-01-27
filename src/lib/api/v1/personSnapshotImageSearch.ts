import { fetchWithTokenRefresh } from "../fetchWithTokenRefresh";

export const ApiV1PersonSnapshotImageSearch = async (
  token: string | null,
  id: string
): Promise<Blob> => {
  const requestObj = new Request(
    new URL(`/api/v1/person/snapshot/image/search/${id}`, process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await fetchWithTokenRefresh(requestObj, token)
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error("Unauthorized");
      }
      const data = await response.blob();
      if (!data) {
        throw new Error("Internal Server Error");
      }
      return new Blob([data], { type: "image/jpeg" });
    })
    .catch(() => {
      throw new Error("Internal Server Error");
    });
};
