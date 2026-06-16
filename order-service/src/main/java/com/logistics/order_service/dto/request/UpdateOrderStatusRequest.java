package com.logistics.order_service.dto.request;

import com.logistics.order_service.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;

    private Long deliveryId;

    @Size(max = 1000)
    private String reason;
}




