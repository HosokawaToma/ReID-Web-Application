import { ApiV1AdminAuthTokenRefresh } from "./v1/adminAuthTokenRefresh";

// グローバルなトークン更新コールバック
let tokenUpdateCallback: ((token: string) => void) | null = null;

// トークン更新コールバックを設定する関数
export const setTokenUpdateCallback = (callback: ((token: string) => void) | null) => {
  tokenUpdateCallback = callback;
};

// リフレッシュ中かどうかを追跡するフラグ
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * 401エラー時に自動的にトークンをリフレッシュして再試行するfetchラッパー
 */
export const fetchWithTokenRefresh = async (
  request: Request,
  token: string | null
): Promise<Response> => {
  // リクエストのbodyを事前に読み取って保存（一度しか読み取れないため）
  const body = request.body ? await request.clone().arrayBuffer() : null;

  const makeRequest = async (currentToken: string | null): Promise<Response> => {
    // トークンがある場合は、Authorizationヘッダーを更新
    const headers = new Headers(request.headers);
    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }

    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: headers,
      body: body,
    });

    return await fetch(modifiedRequest);
  };

  // 最初のリクエストを実行
  let response = await makeRequest(token);

  // 401エラーが発生した場合、トークンをリフレッシュして再試行
  if (response.status === 401) {
    // 既にリフレッシュ中の場合は、そのPromiseを待つ
    if (isRefreshing && refreshPromise) {
      const newToken = await refreshPromise;
      // 新しいトークンで再試行
      response = await makeRequest(newToken);
      return response;
    }

    // リフレッシュを開始
    isRefreshing = true;
    refreshPromise = ApiV1AdminAuthTokenRefresh()
      .then((newToken) => {
        // トークン更新コールバックを呼び出す
        if (tokenUpdateCallback) {
          tokenUpdateCallback(newToken);
        }
        isRefreshing = false;
        refreshPromise = null;
        return newToken;
      })
      .catch((error) => {
        isRefreshing = false;
        refreshPromise = null;
        throw error;
      });

    try {
      const newToken = await refreshPromise;
      // 新しいトークンで再試行
      response = await makeRequest(newToken);
    } catch {
      // リフレッシュに失敗した場合は、元のエラーレスポンスを返す
      return response;
    }
  }

  return response;
};
