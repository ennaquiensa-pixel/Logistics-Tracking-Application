package com.logistics.route_service.dtos.requestDTOs;

import com.logistics.route_service.dtos.LocationDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizeRouteRequest {
    private LocationDTO pointDepart;            // Starting point
    private List<LocationDTO> destinations;     // List of delivery points / destinations
    private LocationDTO pointRetour;            // Optional return point (e.g., warehouse)
}
