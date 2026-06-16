package com.logistics.route_service.dtos.responseDTOs;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapeDTO  {
    private Integer ordre;
    private Double latitude;
    private Double longitude;
    private String nomLieu;
    private String description;
    private Double distanceDepuisPrecedent;
    private Integer dureeDepuisPrecedent;
    private String instructions;


}