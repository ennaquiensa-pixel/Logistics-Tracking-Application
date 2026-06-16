package com.logistics.product_service.repository;

import com.logistics.product_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    List<Product> findByCategoryId(Long categoryId);

//    List<Product> findByBrandId(Long brandId);

    List<Product> findByActiveTrue();

    boolean existsBySku(String sku);
}


