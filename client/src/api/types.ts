/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Pagination {
  current_page: number;
  page_size: number;
  last_page: number;
  total: number;
  has_next_page: boolean;
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
  image_url: string;
  created_at: string;
}

export interface Brand {
  id: number;
  name: string;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  buy_turn: number;
  image_url: string;
  brand: Brand;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  shipping_address: string;
  phone: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user: User;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  confirm_password?: string;
  name?: string;
}

export interface RegisterResponse {}

export interface LoadHomeScreenResponse {
  bestseller_products: Product[];
  top_search_products: Product[];
  categories: Category[];
  brands: Brand[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilter {
  price_range?: PriceRange;
  brand_ids?: number[];
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
  other_same_category_products: Product[];
  other_same_brand_products: Product[];
}

export interface LoadProfileInfoPageResponse {
  user: User;
}

export interface LoadUserOrderPageResponse {
  orders: Order[];
  pagination: Pagination;
}