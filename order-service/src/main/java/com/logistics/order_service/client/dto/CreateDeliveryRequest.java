package com.logistics.order_service.client.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CreateDeliveryRequest(Long orderId,
                                    Long clientId,
                                    AdresseDTO adresseDestination,
                                    AdresseDTO adresseOrigine,
                                    TypeLivraison type,
                                    List<ColisPayload> colis,
                                    LocalDateTime dateLivraisonPrevue,
                                    String notes) {
}




