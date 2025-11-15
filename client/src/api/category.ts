import apiClient from "./apiClient";
import { CreateBrandRequest, CreateBrandResponse, CreateCategoryRequest, CreateCategoryResponse, DeleteBrandRequest, DeleteBrandResponse, DeleteCategoryRequest, DeleteCategoryResponse, ListBrandsRequest, ListBrandsResponse, ListCategoriesRequest, ListCategoriesResponse, UpdateBrandRequest, UpdateBrandResponse, UpdateCategoryRequest, UpdateCategoryResponse } from "./types";

export const createBrand = async (
  req: CreateBrandRequest
): Promise<CreateBrandResponse> => {
  const response = await apiClient.post("/api/admin/brands", req);
  return response.data;
};

export const listBrands = async (
  req: ListBrandsRequest
): Promise<ListBrandsResponse> => {
  const response = await apiClient.get("/api/admin/brands/list", {
    params: req.pagination,
  });
  return response.data;
};

export const updateBrand = async (
  req: UpdateBrandRequest
): Promise<UpdateBrandResponse> => {
  const { brandId, ...body } = req;
  const response = await apiClient.put(`/api/admin/brands/${brandId}`, body);
  return response.data;
};

export const deleteBrand = async (
  req: DeleteBrandRequest
): Promise<DeleteBrandResponse> => {
  const { brandId } = req;
  const response = await apiClient.delete(`/api/admin/brands/${brandId}`);
  return response.data;
};

export const createCategory = async (
  req: CreateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const response = await apiClient.post("/api/admin/categories", req);
  return response.data;
};

export const listCategories = async (
  req: ListCategoriesRequest
): Promise<ListCategoriesResponse> => {
  const response = await apiClient.get("/api/admin/categories/list", {
    params: req.pagination,
  });
  return response.data;
};

export const updateCategory = async (
  req: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> => {
  const { categoryId, ...body } = req;
  const response = await apiClient.put(`/api/admin/categories/${categoryId}`, body);
  return response.data;
};

export const deleteCategory = async (
  req: DeleteCategoryRequest
): Promise<DeleteCategoryResponse> => {
  const { categoryId } = req;
  const response = await apiClient.delete(`/api/admin/categories/${categoryId}`);
  return response.data;
};
