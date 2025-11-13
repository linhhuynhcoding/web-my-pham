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
  min: number;
  max: number;
}

export interface ProductFilter {
  priceRange?: PriceRange; 
  brandIds?: number[]; 
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