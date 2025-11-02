import envConfig from '../config';

export interface LoginResponse {
    accessToken: string;
}

export interface LoginRequest {
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
    throw new Error(
      `Failed to load history: ${response.status} ${response.statusText}. ${errorData.message || ''}`
    );
  }

  return response.json();
};
