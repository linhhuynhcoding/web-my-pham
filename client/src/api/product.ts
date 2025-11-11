import envConfig from '../config';
import {
  LoadHomeScreenResponse,
  LoadProductDetailPageResponse,
  LoadProductsByCategoryResponse,
  ProductFilter,
  ProductOrderBy,
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

export const loadHomeScreen = async (): Promise<LoadHomeScreenResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/home`);
  return handleResponse(response);
};

export const loadProductsByCategory = async (
  categoryId: number,
  filter?: ProductFilter,
  orderBy?: ProductOrderBy,
  pagination?: Pagination
): Promise<LoadProductsByCategoryResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const params = new URLSearchParams();

  if (filter?.price_range) {
    params.append('filter.price_range.min', String(filter.price_range.min));
    params.append('filter.price_range.max', String(filter.price_range.max));
  }

  if (filter?.brand_ids) {
    filter.brand_ids.forEach((id) => params.append('filter.brand_ids', String(id)));
  }

  if (orderBy !== undefined) {
    params.append('order_by', String(orderBy));
  }

  if (pagination) {
    params.append('pagination.current_page', String(pagination.current_page));
    params.append('pagination.page_size', String(pagination.page_size));
  }

  const response = await fetch(
    `${baseUrl}/api/categories/${categoryId}/products?${params.toString()}`
  );

  return handleResponse(response);
};

export const loadProductDetailPage = async (
  productId: number
): Promise<LoadProductDetailPageResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/products/${productId}`);
  return handleResponse(response);
};