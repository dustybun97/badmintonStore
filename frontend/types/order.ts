import { CartItem } from "../lib/cart-context";

export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PaymentInfo = {
  method: "credit_card" | "paypal" | "bank_transfer";
  cardLastFour?: string;
  cardBrand?: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentInfo: PaymentInfo;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
};
