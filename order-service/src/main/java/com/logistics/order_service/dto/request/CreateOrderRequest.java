package com.logistics.order_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long warehouseId;

    private LocalDate expectedDeliveryDate;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal shippingCost;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    @Size(max = 2000)
    private String notes;

    @NotEmpty
    @Valid
    private List<CreateOrderItemRequest> items;
}

