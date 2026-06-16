//package com.logistics.delivery_service.security;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(auth -> auth
//                        // Public endpoints - no authentication required
//                        .requestMatchers("/actuator/**").permitAll()
//                        .requestMatchers("/api/packages/tracking/**").permitAll()
//                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
//
//                        // Delivery endpoints - specific permissions
//                        .requestMatchers(HttpMethod.GET, "/api/deliveries/**").permitAll() // Allow GET without auth
//                        .requestMatchers(HttpMethod.POST, "/api/deliveries").hasAnyAuthority("ADMIN", "MANAGER")
//                        .requestMatchers(HttpMethod.POST, "/api/deliveries/assign").hasAnyAuthority("ADMIN", "MANAGER")
//                        .requestMatchers(HttpMethod.PUT, "/api/deliveries/**").hasAnyAuthority("ADMIN", "MANAGER", "DRIVER")
//                        .requestMatchers(HttpMethod.DELETE, "/api/deliveries/**").hasAnyAuthority("ADMIN", "MANAGER")
//
//                        // Driver specific endpoints
//                        .requestMatchers("/api/deliveries/driver/**").hasAnyAuthority("DRIVER", "ADMIN", "MANAGER")
//                        .requestMatchers("/api/packages/*/scan").hasAnyAuthority("DRIVER", "ADMIN", "MANAGER")
//
//                        // All other requests require authentication
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}