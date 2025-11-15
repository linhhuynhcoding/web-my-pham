import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  listProducts,
  updateProduct,
} from "@/api/admin";
import {
  CreateProductRequest,
  DeleteProductRequest,
  GetProductDetailRequest,
  GetProductDetailResponse,
  ListProductRequest,
  ListProductResponse,
  UpdateProductRequest,
} from "@/api/types";

export const ADMIN_PRODUCTS_QUERY_KEY = "adminProducts";

/**
 * Custom hook to fetch all products for the admin view with filtering and pagination.
 * @param params - The request parameters for pagination, filtering, and ordering.
 * @returns The result of the react-query useQuery hook.
 */
export const useListProducts = (params: ListProductRequest) => {
  return useQuery<ListProductResponse, Error>({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => listProducts(params),
  });
};

/**
 * Custom hook to fetch the details of a single product.
 * @param params - The request parameters, including the product ID.
 * @param options - Options for the useQuery hook, like `enabled`.
 * @returns The result of the react-query useQuery hook.
 */
export const useGetProductDetail = (
  params: GetProductDetailRequest,
  options?: { enabled?: boolean }
) => {
  return useQuery<GetProductDetailResponse, Error>({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, "detail", params.productId],
    queryFn: () => getProductDetail(params),
    enabled: options?.enabled,
  });
};

/**
 * Custom hook to provide a mutation for creating a new product.
 * @returns The result of the react-query useMutation hook.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for updating an existing product.
 * @returns The result of the react-query useMutation hook.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductRequest) => updateProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for deleting a product.
 * @returns The result of the react-query useMutation hook.
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteProductRequest) => deleteProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};