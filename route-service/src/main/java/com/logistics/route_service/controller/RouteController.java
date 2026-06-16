package com.logistics.route_service.controller;

import com.logistics.route_service.dtos.requestDTOs.RouteCalculationRequest;
import com.logistics.route_service.dtos.responseDTOs.RouteCalculationResponse;
import com.logistics.route_service.enums.StatutItineraire;
import com.logistics.route_service.service.RouteService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping("/calculate")
    @CircuitBreaker(name = "routeService", fallbackMethod = "calculateRouteFallback")
    @RateLimiter(name = "routeService")
    public ResponseEntity<RouteCalculationResponse> calculateRoute(
            @Valid @RequestBody RouteCalculationRequest request) {
//        log.info("Received route calculation request for livraisonId: {}", request.getLivraisonId());
        RouteCalculationResponse response = routeService.calculateRoute(request);
        return ResponseEntity.ok(response);
    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<RouteCalculationResponse> getRouteById(@PathVariable Long id) {
//        RouteCalculationResponse response = routeService.getRouteById(id);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/livraison/{livraisonId}")
//    public ResponseEntity<RouteCalculationResponse> getRouteByLivraisonId(
//            @PathVariable Long livraisonId) {
//        RouteCalculationResponse response = routeService.getRouteByLivraisonId(livraisonId);
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/{id}/status")
//    public ResponseEntity<Void> updateRouteStatus(
//            @PathVariable Long id,
//            @RequestParam StatutItineraire status) {
//        routeService.updateRouteStatus(id, status);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/health")
//    public ResponseEntity<String> healthCheck() {
//        return ResponseEntity.ok("Route Service is UP");
//    }
//
//    // Fallback method for circuit breaker
//    public ResponseEntity<RouteCalculationResponse> calculateRouteFallback(
//            RouteCalculationRequest request, Throwable t) {
//        log.error("Route calculation fallback triggered for livraisonId: {}", request.getLivraisonId(), t);
//
//        // Return a basic response or cached response
//        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
//                .body(RouteCalculationResponse.builder()
//                        .statut(StatutItineraire.ERREUR)
//                        .build());
//    }
}