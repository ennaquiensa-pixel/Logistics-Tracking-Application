// Order Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_PAID = 'PARTIALLY_PAID'
}

// Request DTOs
export interface CreateOrderRequest {
  userId: number;
  warehouseId: number;
  expectedDeliveryDate?: string;
  shippingCost: number;
  currency: string;
  notes?: string;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  weightKg?: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  deliveryId?: number;
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
}

// Response DTOs
export interface OrderResponse {
  id: number;
  reference: string;
  userId: number;
  warehouseId: number;
  deliveryId?: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  expectedDeliveryDate?: string;
  notes?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  weightKg?: number;
  totalPrice: number;
}

// Gain Response
export interface GainResponse {
  gain: number;
  currency: string;
  start?: string;
  end?: string;
}

// Filter Types
export interface OrderFilters {
  status?: OrderStatus;
  userId?: number;
  paymentStatus?: PaymentStatus;
  dateDebut?: string;
  dateFin?: string;
}

// Stats Types
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  averageOrderValue: number;
}