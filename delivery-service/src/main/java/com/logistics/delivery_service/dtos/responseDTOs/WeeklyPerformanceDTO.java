package com.logistics.delivery_service.dtos.responseDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WeeklyPerformanceDTO {
    private String name;        // Mon, Tue, ...
    private Long deliveries;    // total deliveries
    private Long completed;     // completed deliveries
    private Double time;        // average delivery time (hours)
}