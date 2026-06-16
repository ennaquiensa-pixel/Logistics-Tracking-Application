package com.logistics.order_service.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {

    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Double weightKg;
}
