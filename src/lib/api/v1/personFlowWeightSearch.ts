export interface PersonFlowWeightSearchResponse {
  weights: PersonFlowWeight[];
}

export interface PersonFlowWeight {
  target_camera_id: string;
  source_camera_id: string;
  weight: number;
}

export const ApiV1PersonFlowWeightSearch = async (
  token: string | null,
): Promise<PersonFlowWeightSearchResponse> => {
  return await fetch(
    new Request(
      new URL("/api/v1/person/flow/weight/search", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "after_timestamp": null,
          "before_timestamp": null,
          "person_ids": null
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
