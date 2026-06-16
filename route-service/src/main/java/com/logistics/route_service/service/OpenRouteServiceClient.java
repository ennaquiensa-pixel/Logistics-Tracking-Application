package com.logistics.route_service.service;

import com.logistics.route_service.dtos.responseDTOs.ORSResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;

@Slf4j
@Service
public class OpenRouteServiceClient {

    @Value("${openrouteservice.api.key}")
    private String apiKey;

    @Value("${openrouteservice.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public OpenRouteServiceClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @Retryable(
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2.0),
            retryFor = {Exception.class}
    )
    public ORSResponse getRoute(double startLat, double startLon, double endLat, double endLon, String profile) {
        log.info("Fetching route from OpenRouteService API");
        log.info("Start: lat={}, lon={}", startLat, startLon);
        log.info("End: lat={}, lon={}", endLat, endLon);

        // Calcul de distance à vol d'oiseau pour vérification
        double straightLineDistance = calculateStraightLineDistance(startLat, startLon, endLat, endLon);
        log.info("Straight-line distance: {} km", straightLineDistance);

        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/v2/directions/" + profile)
                .build()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Authorization", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = String.format(
                "{\"coordinates\":[[%s,%s],[%s,%s]],\"units\":\"km\",\"language\":\"fr\"}",
                formatCoordinate(startLon), formatCoordinate(startLat),
                formatCoordinate(endLon), formatCoordinate(endLat)
        );

        log.debug("Request to ORS: {}", requestBody);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<ORSResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    ORSResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                ORSResponse orsResponse = response.getBody();

                if (orsResponse.getRoutes() != null && !orsResponse.getRoutes().isEmpty()) {
                    // IMPORTANT: Avec "units":"km", la distance est déjà en KILOMÈTRES
                    double distanceKm = orsResponse.getRoutes().get(0).getSummary().getDistance();

                    log.info("Route fetched successfully. Distance: {} km", distanceKm);

                    // Vérification
                    double difference = Math.abs(distanceKm - straightLineDistance);
                    if (difference > straightLineDistance * 0.5) {
                        log.warn("API distance ({}) very different from straight-line distance ({})",
                                distanceKm, straightLineDistance);
                    }

                    return orsResponse;
                }
            }
            throw new RuntimeException("Failed to get route from ORS. Status: " + response.getStatusCode());

        } catch (Exception e) {
            log.error("Error fetching route from ORS: {}", e.getMessage());
            throw e;
        }
    }

    private double calculateStraightLineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Rayon de la Terre en km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;

        return Math.round(distance * 100.0) / 100.0;
    }

    private String formatCoordinate(double value) {
        return String.valueOf(value);
    }
}