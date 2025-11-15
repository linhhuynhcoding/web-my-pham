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

  console.log(filter)

  if (filter?.priceRange) {
    params.append('filter.priceRange.min', String(filter.priceRange.min ?? 0));
    params.append('filter.priceRange.max', String(filter.priceRange.max ?? 100000000000));
  }

  if (filter?.brandIds) {
    filter.brandIds.forEach((id) => params.append('filter.brandIds', String(id)));
  }

  if (orderBy !== undefined) {
    params.append('orderBy', String(orderBy));
  }

  if (pagination) {
    params.append('pagination.currentPage', String(pagination.currentPage));
    params.append('pagination.pageSize', String(pagination.pageSize));
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