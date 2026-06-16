package com.logistics.delivery_service.dtos.responseDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecentActivityDTO {
    private Long id;
    private String driver;
    private String status;
    private String timeAgo;
    private String location;
}