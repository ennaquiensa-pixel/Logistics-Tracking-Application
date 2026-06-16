package com.logistics.order_service.client.dto;

public record AdresseDTO(String rue,
                         String ville,
                         String codePostal,
                         String pays,
                         Double latitude,
                         Double longitude) {
}




