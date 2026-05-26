// ─── User ────────────────────────────────────────────────────────────────────

export interface UserAvatar {
  url: string;
  localPath: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: UserAvatar;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth Requests ───────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserResponseData {
  user: User;
}

export interface RegisterResponseData {
  user: User;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Typed Errors ─────────────────────────────────────────────────────────────

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class AuthError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthError';
  }
}
