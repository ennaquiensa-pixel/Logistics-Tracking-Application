package com.logistics.order_service.dto.response;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class OrderItemResponse {
    Long id;
    String sku;
    String description;
    Integer quantity;
    BigDecimal unitPrice;
    BigDecimal totalPrice;
    Double weightKg;
    Long stockMovementId;
}




