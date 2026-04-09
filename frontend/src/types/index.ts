export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  unit: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
