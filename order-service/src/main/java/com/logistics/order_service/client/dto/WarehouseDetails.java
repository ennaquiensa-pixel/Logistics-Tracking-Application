package com.logistics.order_service.client.dto;

import java.time.LocalDateTime;

public record WarehouseDetails(Long idEntrepot,
                               String code,
                               String nom,
                               TypeEntrepot type,
                               StatutEntrepot statut,
                               AdresseDTO adresse,
                               Integer capaciteMax,
                               Integer capaciteActuelle,
                               Integer capaciteDisponible,
                               Double tauxOccupation,
                               Double superficieM2,
                               String telephone,
                               String email,
                               String responsableNom,
                               String responsableTelephone,
                               String horairesOuverture,
                               String description,
                               LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
}




