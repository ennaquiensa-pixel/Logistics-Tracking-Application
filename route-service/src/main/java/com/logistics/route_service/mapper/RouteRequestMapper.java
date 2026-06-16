//package com.logistics.route_service.mapper;
//
//import com.logistics.route_service.dtos.LocationDTO;
//import com.logistics.route_service.dtos.requestDTOs.RouteCalculationRequest.OriginDestinationDTO;
//import com.logistics.route_service.enums.TypeCalcul;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RouteRequestMapper {
//
//    public LocationDTO toLocationDTO(OriginDestinationDTO originDestinationDTO) {
//        if (originDestinationDTO == null) {
//            return null;
//        }
//
//        // Build full address if not provided
//        String fullAddress = originDestinationDTO.getAdresse();
//        if (fullAddress == null) {
//            fullAddress = buildFullAddress(originDestinationDTO);
//        }
//
//        // Build name if not provided
//        String name = originDestinationDTO.getNom();
//        if (name == null && originDestinationDTO.getRue() != null) {
//            name = originDestinationDTO.getRue();
//        }
//
//        return LocationDTO.builder()
//                .latitude(originDestinationDTO.getLatitude())
//                .longitude(originDestinationDTO.getLongitude())
//                .adresse(fullAddress)
//                .nom(name)
//                .build();
//    }
//
//    public TypeCalcul stringToTypeCalcul(String typeCalculString) {
//        if (typeCalculString == null) {
//            return TypeCalcul.DISTANCE_COURTE;
//        }
//
//        try {
//            return TypeCalcul.valueOf(typeCalculString.toUpperCase());
//        } catch (IllegalArgumentException e) {
//            System.out.println("Unknown route calculation type: {}, defaulting to DISTANCE_COURTE"+ typeCalculString);
//            return TypeCalcul.DISTANCE_COURTE;
//        }
//    }
//
//    private String buildFullAddress(OriginDestinationDTO dto) {
//        StringBuilder sb = new StringBuilder();
//
//        if (dto.getRue() != null) {
//            sb.append(dto.getRue());
//        }
//
//        if (dto.getVille() != null) {
//            if (sb.length() > 0) sb.append(", ");
//            sb.append(dto.getVille());
//        }
//
//        if (dto.getCodePostal() != null) {
//            if (sb.length() > 0) sb.append(" ");
//            sb.append(dto.getCodePostal());
//        }
//
//        if (dto.getPays() != null) {
//            if (sb.length() > 0) sb.append(", ");
//            sb.append(dto.getPays());
//        }
//
//        return sb.length() > 0 ? sb.toString() : null;
//    }
//}