import envConfig from '../config';
import {
  AddCartItemRequest,
  AddCartItemResponse,
  DeleteCartItemRequest,
  DeleteCartItemResponse,
  LoadCartPageResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from './types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

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
  return response.status === 204 ? {} : response.json();
};

export const loadCartPage = async (): Promise<LoadCartPageResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/cart`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addCartItem = async (
  request: AddCartItemRequest
): Promise<AddCartItemResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};

export const updateCartItem = async (
  request: UpdateCartItemRequest
): Promise<UpdateCartItemResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const { cartItemId, ...body } = request;
  const response = await fetch(`${baseUrl}/api/cart/items/${cartItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

export const deleteCartItem = async (
  request: DeleteCartItemRequest
): Promise<DeleteCartItemResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/cart/items/${request.cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};