package com.logistics.route_service.dtos.ORS;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ORSOptimizationResponse {
    @JsonProperty("routes")
    private List<Route> routes;

    @JsonProperty("unassigned")
    private List<Unassigned> unassigned;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Route {
        @JsonProperty("vehicle")
        private Integer vehicle;

        @JsonProperty("steps")
        private List<Step> steps;

        @JsonProperty("cost")
        private Integer cost;

        @JsonProperty("distance")
        private Double distance;

        @JsonProperty("duration")
        private Double duration;

        @JsonProperty("geometry")
        private String geometry;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Step {
        @JsonProperty("type")
        private String type;

        @JsonProperty("arrival")
        private Long arrival;

        @JsonProperty("duration")
        private Long duration;

        @JsonProperty("service")
        private Long service;

        @JsonProperty("waiting_time")
        private Long waitingTime;

        @JsonProperty("job")
        private Integer job;

        @JsonProperty("location")
        private List<Double> location;

        @JsonProperty("load")
        private List<Integer> load;

        @JsonProperty("distance")
        private Double distance;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Unassigned {
        @JsonProperty("id")
        private Integer id;

        @JsonProperty("location")
        private List<Double> location;
    }
}