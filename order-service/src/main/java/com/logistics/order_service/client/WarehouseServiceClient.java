package com.logistics.order_service.client;

import com.logistics.order_service.client.dto.AdresseDTO;
import com.logistics.order_service.client.dto.WarehouseDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "warehouse-service" ,  url = "${warehouse.service.url:http://localhost:8084}")
public interface WarehouseServiceClient {

    @GetMapping("/api/warehouses/{id}")
    WarehouseDetails getEntrepotById(@PathVariable("id") Long id);

    @GetMapping("/api/warehouses/{id}/address")
    AdresseDTO getWarehouseAddress(@PathVariable("id") Long id);
}




