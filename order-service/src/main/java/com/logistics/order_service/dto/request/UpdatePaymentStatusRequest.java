package com.logistics.order_service.dto.request;

import com.logistics.order_service.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdatePaymentStatusRequest {

    @NotNull
    private PaymentStatus paymentStatus;
}




