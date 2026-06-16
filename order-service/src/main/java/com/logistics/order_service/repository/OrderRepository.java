package com.logistics.order_service.repository;

import com.logistics.order_service.enums.OrderStatus;
import com.logistics.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByReference(String reference);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    // Total gain (sum of all totalAmount - shippingCost)
    @Query("SELECT SUM(o.totalAmount - o.shippingCost) FROM Order o")
    BigDecimal getTotalGain();

    // Gain within a specific date range
    @Query("SELECT SUM(o.totalAmount - o.shippingCost) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    BigDecimal getGainBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}




