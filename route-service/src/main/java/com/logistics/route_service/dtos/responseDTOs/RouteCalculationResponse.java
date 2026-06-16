package com.logistics.route_service.dtos.responseDTOs;

import com.logistics.route_service.enums.StatutItineraire;
import com.logistics.route_service.enums.TypeCalcul;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteCalculationResponse {


    private Double distanceKm;
    private Integer dureeMinutes;
    private Double coutEstime;


}