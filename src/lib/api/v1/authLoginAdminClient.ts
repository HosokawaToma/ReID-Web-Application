export class ApiV1AuthLoginAdminClient {
  async request(id: string, password: string): Promise<string> {
    return await fetch(new Request(
      new URL("/api/v1/auth/login/admin_client", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_client_id: id, password: password }),
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
}
