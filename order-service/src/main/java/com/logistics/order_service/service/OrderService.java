package com.logistics.order_service.service;

import com.logistics.order_service.dto.request.CreateOrderRequest;
import com.logistics.order_service.dto.request.UpdateOrderStatusRequest;
import com.logistics.order_service.dto.request.UpdatePaymentStatusRequest;
import com.logistics.order_service.dto.response.OrderResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getOrdersByUser(Long userId);

    OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request);

    OrderResponse updatePaymentStatus(Long id, UpdatePaymentStatusRequest request);

    BigDecimal getTotalGain();

    BigDecimal getGainBetween(LocalDateTime start, LocalDateTime end);

}




