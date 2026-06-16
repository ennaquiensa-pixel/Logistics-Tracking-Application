package com.logistics.route_service.dtos.ORS;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ORSOptimizationRequest {
    @JsonProperty("jobs")
    private List<Job> jobs;

    @JsonProperty("vehicles")
    private List<Vehicle> vehicles;

    @JsonProperty("options")
    private OptimizationOptions options;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Job {
        @JsonProperty("id")
        private Integer id;

        @JsonProperty("location")
        private List<Double> location; // [longitude, latitude]

        @JsonProperty("service")
        private Integer service = 300; // Service time in seconds

        @JsonProperty("description")
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Vehicle {
        @JsonProperty("id")
        private Integer id = 1;

        @JsonProperty("profile")
        private String profile = "driving-hgv";

        @JsonProperty("start")
        private List<Double> start; // [longitude, latitude]

        @JsonProperty("end")
        private List<Double> end; // [longitude, latitude]

        @JsonProperty("capacity")
        private List<Integer> capacity = List.of(1);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptimizationOptions {
        @JsonProperty("g")
        private Boolean g = true;
    }
}