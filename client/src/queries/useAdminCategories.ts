import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  ListCategoriesRequest,
  ListCategoriesResponse,
  UpdateCategoryRequest,
} from "@/api/types";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@/api/category";

export const ADMIN_CATEGORIES_QUERY_KEY = "adminCategories";

/**
 * Custom hook to fetch all categories for the admin view with pagination.
 * @param params - The request parameters for pagination.
 * @returns The result of the react-query useQuery hook.
 */
export const useListCategories = (params: ListCategoriesRequest) => {
  return useQuery<ListCategoriesResponse, Error>({
    queryKey: [ADMIN_CATEGORIES_QUERY_KEY, params],
    queryFn: () => listCategories(params),
  });
};

/**
 * Custom hook to provide a mutation for creating a new category.
 * @returns The result of the react-query useMutation hook.
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for updating an existing category.
 * @returns The result of the react-query useMutation hook.
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to provide a mutation for deleting a category.
 * @returns The result of the react-query useMutation hook.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteCategoryRequest) => deleteCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] });
    },
  });
};