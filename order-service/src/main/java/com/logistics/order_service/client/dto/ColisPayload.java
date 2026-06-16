package com.logistics.order_service.client.dto;

public record ColisPayload(Long packageId,
                           Double poids,
                           String description,
                           String dimensions) {
}




