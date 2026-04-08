// ---------------------------------------------------------------------------
// Shared TypeScript interfaces used by both models and controllers.
// These are the "public" shapes sent over the wire — no passwordHash, etc.
// ---------------------------------------------------------------------------

export interface UserPublic {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  _id: string;
  productId: string | Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Generic API envelope
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// Paginated wrapper (used for product list)
export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth response payload
export interface AuthPayload {
  user: UserPublic;
  token: string;
}

// JWT token contents
export interface UserTokenPayload {
  userId: string;
}
