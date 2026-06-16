export const mockOrders = [
  {
    id: 1,
    reference: "ORD-1001",
    userId: 101,
    warehouseId: 1,
    deliveryId: 201,
    subtotal: 120.0,
    shippingCost: 10.0,
    totalAmount: 130.0,
    status: "IN_PROGRESS",
    paymentStatus: "PAID",
    expectedDeliveryDate: "2025-11-15",
    notes: "Leave at reception",
    currency: "USD",
    createdAt: "2025-11-11T10:00:00",
    updatedAt: "2025-11-11T12:00:00",
    items: [
      { sku: "P001", description: "Product 1", quantity: 2, unitPrice: 50, weightKg: 1.2 },
      { sku: "P002", description: "Product 2", quantity: 1, unitPrice: 20, weightKg: 0.5 }
    ]
  },
  {
    id: 2,
    reference: "ORD-1002",
    userId: 101,
    warehouseId: 2,
    deliveryId: 202,
    subtotal: 200.0,
    shippingCost: 15.0,
    totalAmount: 215.0,
    status: "PENDING",
    paymentStatus: "PENDING",
    expectedDeliveryDate: "2025-11-17",
    notes: "",
    currency: "USD",
    createdAt: "2025-11-11T11:00:00",
    updatedAt: "2025-11-11T11:30:00",
    items: [
      { sku: "P003", description: "Product 3", quantity: 4, unitPrice: 50, weightKg: 2 }
    ]
  }
];
