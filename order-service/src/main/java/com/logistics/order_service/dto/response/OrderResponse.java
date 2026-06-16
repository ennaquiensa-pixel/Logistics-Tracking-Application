package com.logistics.order_service.dto.response;

import com.logistics.order_service.enums.OrderStatus;
import com.logistics.order_service.enums.PaymentStatus;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
public class OrderResponse {
    Long id;
    String reference;
    Long userId;
    Long warehouseId;
    Long deliveryId;
    BigDecimal subtotal;
    BigDecimal shippingCost;
    BigDecimal totalAmount;
    OrderStatus status;
    PaymentStatus paymentStatus;
    LocalDate expectedDeliveryDate;
    String notes;
    String currency;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<OrderItemResponse> items;
}




