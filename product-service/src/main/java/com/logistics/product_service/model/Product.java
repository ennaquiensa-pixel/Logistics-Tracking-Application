package com.logistics.product_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    private Double weightKg;

    private int quantity;
    private String imageUrl;

    @ManyToOne
    private Category category;

    @Column(name = "warehouse_id")
    private Long warehouseId ;
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
