package com.logistics.route_service.service;

import com.logistics.route_service.dtos.requestDTOs.RouteCalculationRequest;
import com.logistics.route_service.dtos.responseDTOs.ORSResponse;
import com.logistics.route_service.dtos.responseDTOs.RouteCalculationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {

    private final OpenRouteServiceClient orsClient;
    private final PricingService pricingService;

    @Transactional
    public RouteCalculationResponse calculateRoute(RouteCalculationRequest request) {
        log.info("Calculating route from origin to destination");

        ORSResponse orsResponse = orsClient.getRoute(
                request.getOrigine().getLatitude(),
                request.getOrigine().getLongitude(),
                request.getDestination().getLatitude(),
                request.getDestination().getLongitude(),
                "driving-car"
        );

        ORSResponse.Route route = orsResponse.getRoutes().get(0);

        // IMPORTANT: La distance est déjà en KILOMÈTRES
        double distanceKm = route.getSummary().getDistance();  // <-- Pas de division par 1000 !

        double durationSeconds = route.getSummary().getDuration();
        int durationMinutes = (int) Math.ceil(durationSeconds / 60);

        log.info("Route distance: {} km", distanceKm);
        log.info("Route duration: {} minutes", durationMinutes);

        // Calculate costs
        PricingService.RouteCost cost = pricingService.calculateCost(distanceKm, "standard");

        return RouteCalculationResponse.builder()
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .dureeMinutes(durationMinutes)
                .coutEstime(Math.round(cost.getTotalCost() * 100.0) / 100.0)
                .build();
    }
//    public RouteCalculationResponse calculateRoute(RouteCalculationRequest request) {
//        log.info("Calculating route from origin to destination");
//
//        // Get route from OpenRouteService
//        ORSResponse orsResponse = orsClient.getRoute(
//                request.getOrigine().getLatitude(),
//                request.getOrigine().getLongitude(),
//                request.getDestination().getLatitude(),
//                request.getDestination().getLongitude(),
//                "driving-car"
//        );
//
//        ORSResponse.Route route = orsResponse.getRoutes().get(0);
//        double distanceMeters = route.getSummary().getDistance();
//        double distanceKm = distanceMeters / 1000.0;
//        double durationSeconds = route.getSummary().getDuration();
//        int durationMinutes = (int) (durationSeconds / 60);
//
//        // Calculate costs
//        PricingService.RouteCost cost = pricingService.calculateCost(distanceKm, "standard");
//
//        // Return response matching your DTO
//        return RouteCalculationResponse.builder()
//                .distanceKm(distanceKm)
//                .dureeMinutes(durationMinutes)
//                .coutEstime(cost.getTotalCost())
//                .build();
//    }
}