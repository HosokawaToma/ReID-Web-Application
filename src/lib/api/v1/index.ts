import { ApiV1AuthLoginAdminClient } from "@/lib/api/v1/authLoginAdminClient";
import { ApiV1AuthRefreshAdminClient } from "@/lib/api/v1/authRefreshAdminClient";

export class ApiV1 {
  constructor(
    private readonly setToken: (token: string | null) => void,
    private readonly getToken: () => string | null,
    private readonly authLoginAdminClient: ApiV1AuthLoginAdminClient,
    private readonly authRefreshAdminClient: ApiV1AuthRefreshAdminClient
  ) { }

  async login(id: string, password: string): Promise<string | null> {
    return await this.authLoginAdminClient.request(id, password).then((token) => {
      this.setToken(token);
      return token;
    }).catch(() => {
      this.setToken(null);
      return null;
    });
  }

  async tokenRefresh(): Promise<string | null> {
    return await this.authRefreshAdminClient.request().then((token) => {
      this.setToken(token);
      return token;
    }).catch(() => {
      this.setToken(null);
      return null
    });
  }

  static create(setToken: (token: string | null) => void, getToken: () => string | null): ApiV1 {
    return new ApiV1(
      setToken,
      getToken,
      new ApiV1AuthLoginAdminClient(),
      new ApiV1AuthRefreshAdminClient()
    );
  }
}
