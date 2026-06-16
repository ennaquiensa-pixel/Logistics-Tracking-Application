package com.logistics.order_service.controller;

import com.logistics.order_service.dto.request.CreateOrderRequest;
import com.logistics.order_service.dto.request.UpdateOrderStatusRequest;
import com.logistics.order_service.dto.request.UpdatePaymentStatusRequest;
import com.logistics.order_service.dto.response.OrderResponse;
import com.logistics.order_service.service.OrderService;
import com.logistics.order_service.service.impl.OrderServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER','CLIENT')")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
//    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
//    @PreAuthorize("hasAuthority('CLIENT') and @orderSecurity.isOwner(#userId)")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                           @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @PutMapping("/{id}/payment")
//    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<OrderResponse> updatePaymentStatus(@PathVariable Long id,
                                                             @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(orderService.updatePaymentStatus(id, request));
    }

    @GetMapping("/gain")
    public Map<String, Object> getTotalGain() {
        BigDecimal gain = orderService.getTotalGain();
        Map<String, Object> response = new HashMap<>();
        response.put("gain", gain);
        response.put("currency", "DH");
        return response;
    }

    // ✅ Optional: Get gain between two dates
    @GetMapping("/gain/range")
    public Map<String, Object> getGainBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        BigDecimal gain = orderService.getGainBetween(start, end);
        Map<String, Object> response = new HashMap<>();
        response.put("gain", gain);
        response.put("currency", "MAD");
        response.put("start", start);
        response.put("end", end);
        return response;
    }


}




