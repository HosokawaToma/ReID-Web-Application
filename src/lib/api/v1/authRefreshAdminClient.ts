export class ApiV1AuthRefreshAdminClient {
  constructor(private readonly setToken: (token: string) => void) {
  }

  async refresh(): Promise<void> {
    return await fetch(new Request(
      new URL("/api/v1/auth/login/admin_client/refresh", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "POST",
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
      this.setToken(token);
    }).catch(() => {
      throw new Error("Internal Server Error");
    });
  }
}
