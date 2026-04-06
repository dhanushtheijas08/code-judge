import { REFRESH_TOKEN_API_URL } from "@/utils/conts";

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(REFRESH_TOKEN_API_URL, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/**
 * `fetch` with credentials; on 401, refreshes the access cookie once and retries the same request.
 */
export async function fetchWithAuthRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const merged: RequestInit = {
    credentials: "include",
    ...init,
  };

  const res = await fetch(input, merged);
  if (res.status !== 401) return res;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return res;

  return fetch(input, merged);
}
