//package com.logistics.route_service.service.ORS;
//
//import com.logistics.route_service.dtos.responseDTOs.ORSResponse;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.web.client.RestTemplateBuilder;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.http.*;
//import org.springframework.retry.annotation.Backoff;
//import org.springframework.retry.annotation.Retryable;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
//
//import java.util.Arrays;
//import java.util.Collections;
//
//@Slf4j
//@Service
//public class OpenRouteServiceClient {
//
//    @Value("${openrouteservice.api.key}")
//    private String apiKey;
//
//    @Value("${openrouteservice.api.url}")
//    private String apiUrl;
//
//    @Value("${openrouteservice.max-distance}")
//    private double maxDistance;
//
//    private final RestTemplate restTemplate;
//
//    public OpenRouteServiceClient(RestTemplateBuilder restTemplateBuilder) {
//        this.restTemplate = restTemplateBuilder.build();
//    }
//
//    @Retryable(
//            maxAttempts = 3,
//            backoff = @Backoff(delay = 1000, multiplier = 2.0),
//            retryFor = {Exception.class}
//    )
//    @Cacheable(value = "routeCache", key = "{#startLat, #startLon, #endLat, #endLon, #profile}")
//    public ORSResponse getRoute(double startLat, double startLon, double endLat, double endLon, String profile) {
//        log.info("Fetching route from ORS for coordinates: ({}, {}) -> ({}, {})",
//                startLat, startLon, endLat, endLon);
//
//        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/v2/directions/" + profile)
//                .build()
//                .toUriString();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
//        headers.set("Authorization", apiKey);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        String requestBody = String.format(
//                "{\"coordinates\":[[%f,%f],[%f,%f]],\"units\":\"km\",\"language\":\"fr\"}",
//                startLon, startLat, endLon, endLat
//        );
//
//        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
//
//        try {
//            ResponseEntity<ORSResponse> response = restTemplate.exchange(
//                    url,
//                    HttpMethod.POST,
//                    entity,
//                    ORSResponse.class
//            );
//
//            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//                ORSResponse orsResponse = response.getBody();
//                double distance = orsResponse.getRoutes().get(0).getSummary().getDistance();
//
//                if (distance > maxDistance) {
//                    throw new IllegalArgumentException(
//                            String.format("Distance %.2f meters exceeds maximum allowed distance %.2f meters",
//                                    distance, maxDistance)
//                    );
//                }
//
//                log.info("Successfully fetched route from ORS. Distance: {} meters", distance);
//                return orsResponse;
//            } else {
//                throw new RuntimeException("Failed to get route from ORS. Status: " + response.getStatusCode());
//            }
//        } catch (Exception e) {
//            log.error("Error fetching route from ORS: {}", e.getMessage(), e);
//            throw e;
//        }
//    }
//}