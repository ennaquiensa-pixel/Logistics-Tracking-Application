package com.logistics.order_service.security;

import com.logistics.order_service.client.UserServiceClient;
import com.logistics.order_service.client.dto.UserDetails;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
@Component("orderSecurity")
@RequiredArgsConstructor
@Slf4j
public class OrderSecurity {

    private final UserServiceClient userServiceClient;

    public boolean isOwner(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("No authentication found");
            return false;
        }

        log.info("Authenticated user: {}, Authorities: {}",
                authentication.getName(),
                authentication.getAuthorities());

        // Check for admin/manager authorities (without ROLE_ prefix)
        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ADMIN") || authority.equals("MANAGER"));

        if (isAdminOrManager) {
            log.info("User has admin/manager authority, granting access");
            return true;
        }

        String email = authentication.getName();
        log.info("the email " ,email);
        try {
            UserDetails user = userServiceClient.getUserByEmail(email);
            boolean isOwner = user != null && user.idUser() != null && user.idUser().equals(userId);
            log.info("Ownership check for user {}: {}", userId, isOwner);
            return isOwner;
        } catch (FeignException ex) {
            log.error("Unable to validate order ownership for email {}", email, ex);
            return false;
        }
    }
}