package com.logistics.product_service.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductRequest {

    private String sku;

    private String name;

    private String description;

    private BigDecimal price;

    private int quantity;

    private Double weightKg;

    private String imageUrl;

    private Long categoryId;

    private Long warehouseId;

}
