import envConfig from '../config';
import {
  LoadProfileInfoPageResponse,
  LoadUserOrderPageResponse,
  Pagination,
} from './types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}. ${
        errorData.message || ''
      }`
    );
  }
  return response.json();
};

export const loadProfileInfoPage =
  async (): Promise<LoadProfileInfoPageResponse> => {
    const baseUrl = envConfig.VITE_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/profile`);
    return handleResponse(response);
  };

export const loadUserOrderPage = async (
  pagination?: Pagination
): Promise<LoadUserOrderPageResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const params = new URLSearchParams();

  if (pagination) {
    params.append('pagination.current_page', String(pagination.current_page));
    params.append('pagination.page_size', String(pagination.page_size));
  }

  const response = await fetch(
    `${baseUrl}/api/orders_history?${params.toString()}`
  );

  return handleResponse(response);
};