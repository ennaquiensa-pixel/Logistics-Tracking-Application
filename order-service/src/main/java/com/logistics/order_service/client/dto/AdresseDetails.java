package com.logistics.order_service.client.dto;

public record AdresseDetails(Long idAdresse,
                             String rue,
                             String ville,
                             String codePostal,
                             String pays,
                             Double latitude,
                             Double longitude,
                             Boolean estPrincipale) {
}

