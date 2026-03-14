import { api } from '../../../core/api';
import type { User } from '../../../types';
import type {
  AuthResult,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserProfileResponse,
  RefreshRequest,
  AccessTokenResponse,
} from '../types';

const mapProfileToUser = (profile: UserProfileResponse): User => {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.username,
    avatar: profile.avatar_url || undefined,
    createdAt: profile.created_at,
  };
};

const fetchMe = async (accessToken: string): Promise<User> => {
  const { data } = await api.get<UserProfileResponse>('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return mapProfileToUser(data);
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResult> => {
    const payload: LoginRequest = { email, password };
    const { data } = await api.post<TokenResponse>('/auth/login', payload);
    const user = await fetchMe(data.access_token);
    return {
      user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  },

  register: async (
    email: string,
    password: string,
    username: string,
    fullName?: string
  ): Promise<AuthResult> => {
    const payload: RegisterRequest = {
      email,
      password,
      username,
      full_name: fullName ?? null,
    };
    const { data } = await api.post<TokenResponse>('/auth/register', payload);
    const user = await fetchMe(data.access_token);
    return {
      user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    const payload: RefreshRequest = { refresh_token: refreshToken };
    await api.post('/auth/logout', payload);
  },

  refresh: async (refreshToken: string): Promise<string> => {
    const payload: RefreshRequest = { refresh_token: refreshToken };
    const { data } = await api.post<AccessTokenResponse>('/auth/refresh', payload);
    return data.access_token;
  },
};
