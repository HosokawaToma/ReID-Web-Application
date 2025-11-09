import { ApiV1AuthLoginAdminClient } from "@/lib/api/v1/authLoginAdminClient";
import { ApiV1AuthRefreshAdminClient } from "@/lib/api/v1/authRefreshAdminClient";

export class ApiV1 {
  constructor(
    readonly authLoginAdminClient: ApiV1AuthLoginAdminClient,
    readonly authRefreshAdminClient: ApiV1AuthRefreshAdminClient
  ) {}

  static create(setToken: (token: string) => void, getToken: () => string | null): ApiV1 {
    return new ApiV1(
      new ApiV1AuthLoginAdminClient(setToken),
      new ApiV1AuthRefreshAdminClient(setToken)
    );
  }
}
