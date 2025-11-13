import envConfig from '../config';
import { RegisterRequest, RegisterResponse, User } from './types';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (
  requestBody: LoginRequest
): Promise<LoginResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(`Failed to login: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
  }

  return response.json();
};

export const register = async (
  requestBody: RegisterRequest
): Promise<RegisterResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(
      `Failed to register: ${response.status} ${response.statusText}. ${
        errorData.message || ''
      }`
    );
  }

  return response.json();
};
