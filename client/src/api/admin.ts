import apiClient from "./apiClient";
import {
  CreateBrandRequest,
  CreateBrandResponse,
  DeleteBrandRequest,
  DeleteBrandResponse,
  ListBrandsRequest,
  ListBrandsResponse,
  UpdateBrandRequest,
  UpdateBrandResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  AdminLoadOrdersRequest,
  AdminLoadOrdersResponse,
  CreateProductRequest,
  CreateProductResponse,
  GetProductDetailRequest,
  GetProductDetailResponse,
  ListProductRequest,
  ListProductResponse,
  LoadAccountsRequest,
  LoadAccountsResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductRequest,
  DeleteProductResponse,
  UploadFileRequest,
  UploadFileResponse,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  ListCategoriesRequest,
  ListCategoriesResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "./types";

/**
 * Fetches a paginated list of user accounts from the server.
 * @param req - The request object containing pagination parameters.
 * @returns A promise that resolves to the list of users and pagination details.
 */
export const getAccounts = async (
  req: LoadAccountsRequest
): Promise<LoadAccountsResponse> => {
  const { pagination } = req;
  const params = {
    page: pagination?.currentPage || 1,
    limit: pagination?.pageSize || 10,
  };

  const response = await apiClient.get("/api/accounts", { params });
  return response.data;
};

/**
 * Fetches a paginated and filtered list of all orders for an admin.
 * @param req - The request object containing pagination and filter parameters.
 * @returns A promise that resolves to the list of orders and pagination details.
 */
export const adminLoadOrders = async (
  req: AdminLoadOrdersRequest
): Promise<AdminLoadOrdersResponse> => {
  const response = await apiClient.post("/api/admin/orders", req);
  return response.data;
};

/**
 * Updates the status of a specific order.
 * @param req - The request object containing the order ID and new status.
 * @returns A promise that resolves to the updated order.
 */
export const updateOrderStatus = async (
  req: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusResponse> => {
  const { orderId, ...body } = req;
  const response = await apiClient.put(`/api/admin/orders/${orderId}/status`, body);
  return response.data;
};

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
  const response = await apiClient.put(
    `/api/admin/categories/${categoryId}`,
    body
  );
  return response.data;
};

export const deleteCategory = async (
  req: DeleteCategoryRequest
): Promise<DeleteCategoryResponse> => {
  const { categoryId } = req;
  const response = await apiClient.delete(`/api/admin/categories/${categoryId}`);
  return response.data;
};

export const listProducts = async (
  req: ListProductRequest
): Promise<ListProductResponse> => {
  const response = await apiClient.post("/api/admin/list-products", req);
  return response.data;
};

/**
 * Creates a new product.
 * @param req - The request object containing the product data.
 * @returns A promise that resolves to the newly created product.
 */
export const createProduct = async (
  req: CreateProductRequest
): Promise<CreateProductResponse> => {
  const response = await apiClient.post("/api/admin/products", req);
  return response.data;
};

/**
 * Updates an existing product.
 * @param req - The request object containing the product ID and the fields to update.
 * @returns A promise that resolves to the updated product.
 */
export const updateProduct = async (
  req: UpdateProductRequest
): Promise<UpdateProductResponse> => {
  const { productId, ...body } = req;
  const response = await apiClient.put(`/api/admin/products/${productId}`, body);
  return response.data;
};

/**
 * Deletes a product.
 * @param req - The request object containing the product ID to delete.
 * @returns A promise that resolves when the product is deleted.
 */
export const deleteProduct = async (
  req: DeleteProductRequest
): Promise<DeleteProductResponse> => {
  const { productId } = req;
  const response = await apiClient.delete(`/api/admin/products/${productId}`);
  return response.data;
};

/**
 * Fetches the details of a single product for the admin view.
 * @param req - The request object containing the product ID.
 * @returns A promise that resolves to the detailed product information.
 */
export const getProductDetail = async (
  req: GetProductDetailRequest
): Promise<GetProductDetailResponse> => {
  const response = await apiClient.get(`/api/admin/products/${req.productId}`);
  return response.data;
};

/**
 * Uploads a file to the server using multipart/form-data.
 * @param req - The request containing the file to upload.
 * @returns A promise that resolves with the details of the uploaded file.
 */
export const uploadFile = async (
  req: UploadFileRequest
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file_data", req.file_data);

  const response = await apiClient.post("/v1/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
