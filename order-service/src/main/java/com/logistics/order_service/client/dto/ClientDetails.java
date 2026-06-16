package com.logistics.order_service.client.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ClientDetails(Long idUser,
                            String email,
                            String nom,
                            String telephone,
                            Boolean active,
                            LocalDateTime createdAt,
                            List<AdresseDetails> adresses) {
}

