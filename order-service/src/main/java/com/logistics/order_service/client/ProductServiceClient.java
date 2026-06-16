package com.logistics.order_service.client;

import com.logistics.order_service.client.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", path = "/products")
public interface ProductServiceClient {

    @GetMapping("/sku/{sku}")
    ProductDTO getProductBySku(@PathVariable("sku") String sku);
}
