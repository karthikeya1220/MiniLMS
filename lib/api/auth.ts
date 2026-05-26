import { apiClient } from './client';
import type {
  ApiResponse,
  CurrentUserResponseData,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  User,
} from '../../types/auth';

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Authenticates a user and returns tokens + user object.
   */
  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/api/v1/users/login',
      credentials,
    );
    return response.data.data;
  },

  /**
   * Registers a new user account.
   * Callers should call login() afterwards to obtain tokens.
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<RegisterResponseData>>(
      '/api/v1/users/register',
      data,
    );
    return response.data.data.user;
  },

  /**
   * Validates the current token and returns the authenticated user.
   * Used for auto-login on app start.
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<CurrentUserResponseData>>(
      '/api/v1/users/current-user',
    );
    return response.data.data.user;
  },
} as const;
