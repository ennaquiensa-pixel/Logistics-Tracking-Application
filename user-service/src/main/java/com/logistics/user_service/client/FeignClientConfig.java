package com.logistics.user_service.client;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

@Configuration
@Slf4j
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return (RequestTemplate template) -> {
            log.info("=== FEIGN INTERCEPTOR ===");
            log.info("Feign call to: {} {}", template.method(), template.url());

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null) {
                log.warn("❌ No authentication found in SecurityContext");
                return;
            }

            log.info("✅ Authentication found: {}", authentication.getName());
            log.info("✅ Authentication class: {}", authentication.getClass().getName());
            log.info("✅ Principal class: {}", authentication.getPrincipal().getClass().getName());
            log.info("✅ Credentials: {}", authentication.getCredentials());

            Object principal = authentication.getPrincipal();

            if (principal instanceof Jwt jwt) {
                String token = jwt.getTokenValue();
                log.info("✅ JWT token found, adding to headers");
                template.header("Authorization", "Bearer " + token);
            } else {
                log.warn("❌ Principal is not Jwt, it's: {}", principal.getClass().getName());
                // Try to extract token from credentials
                if (authentication.getCredentials() instanceof String token) {
                    log.info("✅ Found token in credentials");
                    template.header("Authorization", "Bearer " + token);
                }
            }

            log.info("✅ Final headers: {}", template.headers());
        };
    }
}