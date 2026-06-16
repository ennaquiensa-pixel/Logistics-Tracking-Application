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
public class ORSDirectionsResponse {
    @JsonProperty("routes")
    private List<Route> routes;

    @JsonProperty("bbox")
    private List<Double> bbox;

    @JsonProperty("metadata")
    private Metadata metadata;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Route {
        @JsonProperty("summary")
        private Summary summary;

        @JsonProperty("segments")
        private List<Segment> segments;

        @JsonProperty("bbox")
        private List<Double> bbox;

        @JsonProperty("geometry")
        private String geometry; // Encoded polyline

        @JsonProperty("way_points")
        private List<Integer> wayPoints;

        @JsonProperty("warnings")
        private List<Warning> warnings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        @JsonProperty("distance")
        private Double distance; // In meters

        @JsonProperty("duration")
        private Double duration; // In seconds

        @JsonProperty("ascent")
        private Double ascent;

        @JsonProperty("descent")
        private Double descent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Segment {
        @JsonProperty("distance")
        private Double distance; // In meters

        @JsonProperty("duration")
        private Double duration; // In seconds

        @JsonProperty("steps")
        private List<Step> steps;

        @JsonProperty("ascent")
        private Double ascent;

        @JsonProperty("descent")
        private Double descent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Step {
        @JsonProperty("distance")
        private Double distance;

        @JsonProperty("duration")
        private Double duration;

        @JsonProperty("type")
        private Integer type;

        @JsonProperty("instruction")
        private String instruction;

        @JsonProperty("name")
        private String name;

        @JsonProperty("way_points")
        private List<Integer> wayPoints;

        @JsonProperty("exit_number")
        private Integer exitNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Warning {
        @JsonProperty("code")
        private Integer code;

        @JsonProperty("message")
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metadata {
        @JsonProperty("attribution")
        private String attribution;

        @JsonProperty("service")
        private String service;

        @JsonProperty("timestamp")
        private Long timestamp;

        @JsonProperty("query")
        private Map<String, Object> query;

        @JsonProperty("engine")
        private Engine engine;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Engine {
        @JsonProperty("version")
        private String version;

        @JsonProperty("build_date")
        private String buildDate;

        @JsonProperty("graph_date")
        private String graphDate;
    }
}