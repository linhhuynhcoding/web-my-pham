import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateBrandRequest,
  DeleteBrandRequest,
  ListBrandsRequest,
  ListBrandsResponse,
  UpdateBrandRequest,
} from "@/api/types";
import { createBrand, deleteBrand, listBrands, updateBrand } from "@/api/brand";

export const ADMIN_BRANDS_QUERY_KEY = "adminBrands";

/**
 * Custom hook to fetch all brands for the admin view with pagination.
 * @param params - The request parameters for pagination.
 * @returns The result of the react-query useQuery hook.
 */
export const useListBrands = (params: ListBrandsRequest) => {
  return useQuery<ListBrandsResponse, Error>({
    queryKey: [ADMIN_BRANDS_QUERY_KEY, params],
    queryFn: () => listBrands(params),
  });
};

/**
 * Custom hook to provide a mutation for creating a new brand.
 * @returns The result of the react-query useMutation hook.
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandRequest) => createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for updating an existing brand.
 * @returns The result of the react-query useMutation hook.
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBrandRequest) => updateBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for deleting a brand.
 * @returns The result of the react-query useMutation hook.
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteBrandRequest) => deleteBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] });
    },
  });
};
