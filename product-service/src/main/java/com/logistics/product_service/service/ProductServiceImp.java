package com.logistics.product_service.service;

import com.logistics.product_service.dto.request.CreateProductRequest;
import com.logistics.product_service.dto.response.ProductResponse;
import com.logistics.product_service.model.Category;
import com.logistics.product_service.model.Product;
import com.logistics.product_service.repository.CategoryRepository;
import com.logistics.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImp implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {
        // Validate SKU uniqueness
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU '" + request.getSku() + "' already exists");
        }

        // Validate required category
        if (request.getCategoryId() == null || request.getCategoryId() <= 0) {
            throw new IllegalArgumentException("Category is required for product creation");
        }

        Product product = new Product();

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeightKg(request.getWeightKg());

        // Set image: use request URL or random if null/empty
        if (request.getImageUrl() == null || request.getImageUrl().isBlank()) {
            product.setImageUrl(getRandomImageUrl(request.getSku()));
        } else {
            product.setImageUrl(request.getImageUrl());
        }

        // Set warehouse ID if provided (make this required too if needed)
        product.setWarehouseId(request.getWarehouseId());

        // Set category - REQUIRED
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Category not found with ID: " + request.getCategoryId() +
                                ". Please select a valid category."
                ));
        product.setCategory(category);

        // Set timestamps
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse getBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new EntityNotFoundException("Product not found for SKU: " + sku));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllActive() {
        return productRepository.findByActiveTrue()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getByCategory(Long categoryId) {
        // Verify category exists first
        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Category not found");
        }

        return productRepository.findByCategoryId(categoryId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Validate SKU uniqueness (except for current product)
        if (!product.getSku().equals(request.getSku()) &&
                productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU '" + request.getSku() + "' already exists");
        }

        // Validate category for update
        if (request.getCategoryId() == null || request.getCategoryId() <= 0) {
            throw new IllegalArgumentException("Category is required");
        }

        mapRequestToProduct(request, product);
        product.setUpdatedAt(LocalDateTime.now());

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    // ------------------------------------
    // MAPPING UTILITIES
    // ------------------------------------

    private void mapRequestToProduct(CreateProductRequest request, Product product) {
        // Basic fields
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeightKg(request.getWeightKg());
        product.setImageUrl(request.getImageUrl());
        product.setWarehouseId(request.getWarehouseId());

        // Category - REQUIRED
        if (request.getCategoryId() != null && request.getCategoryId() > 0) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Category not found with ID: " + request.getCategoryId()
                    ));
            product.setCategory(category);
        } else {
            throw new IllegalArgumentException("Category is required");
        }
    }

    private String getRandomImageUrl(String seed) {
        // seed can be product SKU or ID
        return "https://picsum.photos/200/200?random=" + seed;
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setWeightKg(product.getWeightKg());
        response.setImageUrl(product.getImageUrl());

        // Category is required, so it should never be null
        if (product.getCategory() == null) {
            throw new IllegalStateException("Product category is null for product ID: " + product.getId());
        }
        response.setCategoryId(product.getCategory().getId());

        // Warehouse ID can be null
        response.setWarehouseId(product.getWarehouseId());

        response.setActive(product.isActive());
        return response;
    }
}