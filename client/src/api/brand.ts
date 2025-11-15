import apiClient from "./apiClient";
import { CreateBrandRequest, CreateBrandResponse, ListBrandsRequest, ListBrandsResponse, UpdateBrandRequest, UpdateBrandResponse, DeleteBrandRequest, DeleteBrandResponse } from "./types";

/**
 * Creates a new brand.
 * @param req - The request object containing the brand's name and image URL.
 * @returns A promise that resolves to the newly created brand.
 */
export const createBrand = async (
  req: CreateBrandRequest
): Promise<CreateBrandResponse> => {
  const response = await apiClient.post("/api/admin/brands", req);
  return response.data;
};

/**
 * Fetches a paginated list of all brands.
 * @param req - The request object containing pagination parameters.
 * @returns A promise that resolves to the list of brands and pagination details.
 */
export const listBrands = async (
  req: ListBrandsRequest
): Promise<ListBrandsResponse> => {
  const response = await apiClient.get("/api/admin/brands/list", {
    params: req.pagination,
  });
  return response.data;
};

/**
 * Updates an existing brand.
 * @param req - The request object containing the brand ID and the fields to update.
 * @returns A promise that resolves to the updated brand.
 */
export const updateBrand = async (
  req: UpdateBrandRequest
): Promise<UpdateBrandResponse> => {
  const { brandId, ...body } = req;
  const response = await apiClient.put(`/api/admin/brands/${brandId}`, body);
  return response.data;
};

/**
 * Deletes a brand.
 * @param req - The request object containing the brand ID to delete.
 * @returns A promise that resolves when the brand is deleted.
 */
export const deleteBrand = async (
  req: DeleteBrandRequest
): Promise<DeleteBrandResponse> => {
  const { brandId } = req;
  const response = await apiClient.delete(`/api/admin/brands/${brandId}`);
  return response.data;
};