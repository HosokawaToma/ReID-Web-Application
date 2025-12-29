export const ApiV1AdminAuthLogin = async (id: string, password: string): Promise<string> => {
  return await fetch(new Request(
    new URL("/api/v1/admin/auth/login", process.env.NEXT_PUBLIC_API_URL as string),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, password: password }),
    }
  )).then(async (response) => {
    if (response.status !== 200) {
      throw new Error("Unauthorized");
    }
    const data = await response.json();
    const token = data.token;
    if (!token) {
      throw new Error("Internal Server Error");
    }
    if (typeof token !== "string") {
      throw new Error("Internal Server Error");
    }
    return token;
  }).catch(() => {
    throw new Error("Internal Server Error");
  });
}

