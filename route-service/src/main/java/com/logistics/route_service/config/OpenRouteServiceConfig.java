package com.logistics.route_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class OpenRouteServiceConfig {

    @Value("${openrouteservice.api.key}")
    private String apiKey;

    @Value("${openrouteservice.api.url:https://api.openrouteservice.org}")
    private String apiUrl;

    @Bean
    public WebClient openRouteServiceWebClient() {
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", apiKey)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }
}