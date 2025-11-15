/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Pagination {
  currentPage?: number;
  pageSize?: number;
  lastPage?: number;
  total?: number;
  hasNextPage?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export interface Brand {
  id: number;
  name: string;
  imageUrl: string;
  bgUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category; 
  stock: number;
  buyTurn: number;
  imageUrl: string;
  brand: Brand; 
  createdAt: string;
  updatedAt: string;
  discount: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product; 
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  shippingAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User;
  orderDate: string;
  userEmail: string;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export interface RegisterResponse {}

export interface LoadHomeScreenResponse {
  bestsellerProducts: Product[]; 
  topSearchProducts: Product[]; 
  categories: Category[];
  brands: Brand[];
}

export interface PriceRange {
  min?: number;
  max?: number;
}

export interface ProductFilter {
  priceRange?: PriceRange; 
  brandIds?: number[]; 
  keyword?: string;
  categoryIds?: number[];
}

export enum ProductOrderBy {
  BEST_SELLER = 0,
  PRICE_ASC = 1,
  PRICE_DESC = 2,
}

export interface LoadProductsByCategoryResponse {
  products: Product[];
  pagination: Pagination; 
  brands: Brand[];
}

export interface LoadProductDetailPageResponse {
  product: Product;
  otherSameCategoryProducts: Product[];
  otherSameBrandProducts: Product[];
}

export interface LoadProfileInfoPageResponse {
  user: User;
}

export interface LoadUserOrderPageResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface LoadCartPageResponse {
  items: CartItem[];
  totalPrice: number;
  checkOutBill: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

export interface UpdateCartItemResponse {
  item: CartItem;
}

export interface DeleteCartItemRequest {
  cartItemId: number;
}

export interface DeleteCartItemResponse {}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface AddCartItemResponse {
  item: CartItem;
}

export interface LoadCheckoutPageRequest {
  cartItemIds?: number[];
}

export interface OrderInfo {
  id?: number;
  items?: CartItem[];
  shippingFee?: number;
  totalPrice?: number;
}

export enum PaymentMethodType {
  PAYMENT_METHOD_TYPE_UNSPECIFIED = 0,
  CASH_ON_DELIVERY = 1,
  VNPAY = 2,
}

export interface PaymentMethod {
  type: PaymentMethodType;
  name: string;
}

export interface OrderDetailForm {
  availablePaymentMethods: PaymentMethod[];
}

export interface LoadCheckoutPageResponse {
  orderInfo: OrderInfo;
  orderDetailForm: OrderDetailForm;
}

export interface PlaceOrderRequest {
  order_detail_form: {
    payment_method: PaymentMethodType;
    notes: string;
    address: string;
    phone: string;
  };
  cart_item_ids: number[];
}

export interface PlaceOrderResponse {
  orderInfo: OrderInfo;
}

export interface LoadAccountsRequest {
  pagination?: Pagination;
}

export interface LoadAccountsResponse {
  users: User[];
  pagination: Pagination;
}

export interface AmountRange {
  min?: number;
  max?: number;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface AdminOrderFilter {
  dateRange?: DateRange;
  totalAmountRange?: AmountRange;
  userEmail?: string;
  status?: string;
  orderId?: number;
}

export enum AdminOrderOrderBy {
  ORDER_DATE_DESC = 0,
  ORDER_DATE_ASC = 1,
  TOTAL_AMOUNT_DESC = 2,
  TOTAL_AMOUNT_ASC = 3,
}

export interface AdminLoadOrdersRequest {
  pagination?: Pagination;
  filter?: AdminOrderFilter;
  orderBy?: AdminOrderOrderBy;
}

export interface AdminLoadOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface UpdateOrderStatusRequest {
  orderId: number;
  status: string;
}

export interface UpdateOrderStatusResponse {
  order: Order;
}

export interface CreateBrandRequest {
  name: string;
  imageUrl?: string;
}

export interface CreateBrandResponse {
  brand: Brand;
}

export interface ListBrandsRequest {
  pagination?: Pagination;
}

export interface ListBrandsResponse {
  brands: Brand[];
  pagination: Pagination;
}

export interface UpdateBrandRequest {
  brandId: number;
  name?: string;
  imageUrl?: string;
}

export interface UpdateBrandResponse {
  brand: Brand;
}

export interface DeleteBrandRequest {
  brandId: number;
}

export interface DeleteBrandResponse {}

export interface CreateCategoryRequest {
  name: string;
  imageUrl?: string;
}

export interface CreateCategoryResponse {
  category: Category;
}

export interface ListCategoriesRequest {
  pagination?: Pagination;
}

export interface ListCategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

export interface UpdateCategoryRequest {
  categoryId: number;
  name?: string;
  imageUrl?: string;
}

export interface UpdateCategoryResponse {
  category: Category;
}

export interface DeleteCategoryRequest {
  categoryId: number;
}

export interface DeleteCategoryResponse {}

export interface ListProductRequest {
  pagination?: Pagination;
  filter?: ProductFilter;
  orderBy?: ProductOrderBy;
}

export interface ListProductResponse {
  products: Product[];
  pagination: Pagination;
}

export interface CreateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
  brandId?: number;
  stock?: number;
  buyTurn?: number;
}

export interface CreateProductResponse {
  product: Product;
}

export interface UpdateProductRequest {
  productId: number;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
  brandId?: number;
  stock?: number;
}

export interface UpdateProductResponse {
  product: Product;
}

export interface DeleteProductRequest {
  productId: number;
}

export interface DeleteProductResponse {}

export interface GetProductDetailRequest {
  productId: number;
}

export interface GetProductDetailResponse {
  product: Product;
}

export interface UploadFileRequest {
  file_data: File;
}

export interface UploadFileResponse {
  message: string;
  fileId: string;
  file_url: string;
}

export interface GetOrderResponse {
  order: Order;
}