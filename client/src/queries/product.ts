import { useQuery } from '@tanstack/react-query';
import {
  loadHomeScreen,
  loadProductDetailPage,
  loadProductsByCategory,
} from '../api/product';
import { Pagination, ProductFilter, ProductOrderBy } from '../api/types';

const productKeys = {
  all: ['products'] as const,
  home: () => [...productKeys.all, 'home'] as const,
  category: (
    categoryId: number,
    filter?: ProductFilter,
    orderBy?: ProductOrderBy,
    pagination?: Pagination
  ) =>
    [
      ...productKeys.all,
      'category',
      categoryId,
      { filter, orderBy, pagination },
    ] as const,
  detail: (productId: number) =>
    [...productKeys.all, 'detail', productId] as const,
};

export const useHomeScreen = () => {
  return useQuery({
    queryKey: productKeys.home(),
    queryFn: loadHomeScreen,
  });
};

export const useProductsByCategory = (
  categoryId: number,
  filter?: ProductFilter,
  orderBy?: ProductOrderBy,
  pagination?: Pagination
) => {
  return useQuery({
    queryKey: productKeys.category(categoryId, filter, orderBy, pagination),
    queryFn: () => loadProductsByCategory(categoryId, filter, orderBy, pagination),
    enabled: !!categoryId, // Only run the query if categoryId is available
  });
};

export const useProductDetail = (productId: number) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => loadProductDetailPage(productId),
    enabled: !!productId, // Only run the query if productId is available
  });
};