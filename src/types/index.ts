export type ProductType = "consulting" | "course";

export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price_cents: number;
  stripe_price_id: string;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string;
  customer_name: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_cents: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}
