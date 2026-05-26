import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { secureStorage } from '../storage/secure';
import { NetworkError, TimeoutError } from '../../types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Extends InternalAxiosRequestConfig with a _retry flag to prevent the
 * 401-handler from triggering an infinite retry loop (see BUGS.md).
 */
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── Unauthorized Handler ─────────────────────────────────────────────────────

/**
 * This callback is set by AuthContext after mount.
 * Keeps the Axios client decoupled from React navigation.
 */
let _onUnauthorized: (() => Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: () => Promise<void>): void {
  _onUnauthorized = handler;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const BASE_URL =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ?? 'https://api.freeapi.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor: Inject Auth Token ───────────────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor: 401 + Typed Errors ────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    // Handle 401 — but only once per request (_retry guard from BUGS.md)
    if (
      error.response?.status === 401 &&
      originalRequest != null &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await secureStorage.deleteToken();
      await _onUnauthorized?.();
      return Promise.reject(error);
    }

    // Remap timeout errors to a typed class
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new TimeoutError());
    }

    // Remap network errors (no response received) to a typed class
    if (!error.response) {
      return Promise.reject(new NetworkError());
    }

    return Promise.reject(error);
  },
);

// ─── Retry Wrapper ────────────────────────────────────────────────────────────

/**
 * Retries a Promise-returning function up to maxAttempts times with
 * exponential backoff (1s → 2s → 4s).
 *
 * Only retries on NetworkError, TimeoutError, or HTTP 5xx responses.
 * 4xx errors are not retried (they indicate a client-side problem).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const isRetryable =
        err instanceof NetworkError ||
        err instanceof TimeoutError ||
        (axios.isAxiosError(err) &&
          err.response != null &&
          err.response.status >= 500);

      if (!isRetryable || attempt === maxAttempts - 1) {
        break;
      }

      // Exponential backoff: 1000ms, 2000ms, 4000ms
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1_000 * Math.pow(2, attempt)),
      );
    }
  }

  throw lastError;
}
