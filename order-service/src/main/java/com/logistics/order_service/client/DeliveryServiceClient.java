package com.logistics.order_service.client;

import com.logistics.order_service.client.dto.AdresseDTO;
import com.logistics.order_service.client.dto.AssignLivreurRequest;
import com.logistics.order_service.client.dto.ColisPayload;
import com.logistics.order_service.client.dto.CreateDeliveryRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "delivery-service")
public interface DeliveryServiceClient {

    @PostMapping("/api/deliveries")
    DeliveryResponse createLivraison(@RequestBody CreateDeliveryRequest request);

    @PostMapping("/api/deliveries/assign")
    DeliveryResponse assignDriver(@RequestBody AssignLivreurRequest request);

    @GetMapping("/api/deliveries/order/{orderId}")
    Long getLivraisonByOrderId(@PathVariable("orderId") Long orderId);
    record DeliveryResponse(
            Long idLivraison,      // Must match delivery service response
            Long orderId,
            Long clientId,
            Long livreurId,
            String livreurNom,
            String status       // If you need status
            // Add other fields you need
    ) {}
}




