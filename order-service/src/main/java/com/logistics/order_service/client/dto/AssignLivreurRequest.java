package com.logistics.order_service.client.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignLivreurRequest {

    @NotNull(message = "Delivery ID is required")
    private Long livraisonId;

    private Long livreurId; // Si null, assignation automatique
}
