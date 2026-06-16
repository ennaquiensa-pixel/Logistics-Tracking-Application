package com.logistics.order_service.client.dto;

import java.time.LocalDateTime;

public record UserDetails(Long idUser,
                          String email,
                          String role,
                          String nom,
                          String telephone,
                          Boolean active,
                          LocalDateTime createdAt) {
}

