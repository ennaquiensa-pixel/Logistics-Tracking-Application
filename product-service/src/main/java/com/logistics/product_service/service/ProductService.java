package com.logistics.product_service.service;

import com.logistics.product_service.dto.request.CreateProductRequest;
import com.logistics.product_service.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse getById(Long id);

    ProductResponse getBySku(String sku);

    List<ProductResponse> getAllActive();

    List<ProductResponse> getByCategory(Long categoryId);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long id, CreateProductRequest request);

    void deleteProduct(Long id);
}
