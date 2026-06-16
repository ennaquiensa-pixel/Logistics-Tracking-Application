package com.logistics.route_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleRouteResponse {
    private Double distanceKm;
    private Integer dureeMinutes;
    private Double coutEstime;
    private Double coutCarburant;
    private Double emissionsCo2;
    private String polyline;
    private String status;
    private String message;
}