package com.logistics.api_gateway;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class HeaderDebugFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        System.out.println("=== INCOMING REQUEST ===");
        System.out.println("Origin: " + exchange.getRequest().getHeaders().getOrigin());
        System.out.println("Method: " + exchange.getRequest().getMethod());

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            System.out.println("=== RESPONSE HEADERS ===");
            exchange.getResponse().getHeaders().forEach((key, values) -> {
                System.out.println(key + ": " + values);
            });
        }));
    }
}