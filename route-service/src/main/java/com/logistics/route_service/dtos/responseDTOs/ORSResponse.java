package com.logistics.route_service.dtos.responseDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ORSResponse {
    private List<Route> routes;
    private Metadata metadata;

    @Data
    public static class Metadata {
        private Query query;
        private Engine engine;
        private String service;
        private long timestamp;

        @Data
        public static class Query {
            private List<List<Double>> coordinates;
            private String profile;
            private String format;
            private String units;
        }

        @Data
        public static class Engine {
            private String version;
            private String build_date;
            private String graph_date;
        }
    }

    @Data
    public static class Route {
        private Summary summary;
        private List<Segment> segments;
        private List<Double> bbox;
        private String geometry;

        @JsonProperty("way_points")
        private List<Integer> wayPoints;  // CHANGED from List<List<Double>>

        @Data
        public static class Summary {
            private double distance; // in meters
            private double duration; // in seconds
        }

        @Data
        public static class Segment {
            private double distance;
            private double duration;
            private List<Step> steps;

            @Data
            public static class Step {
                private double distance;
                private double duration;
                private int type;
                private String instruction;
                private String name;

                @JsonProperty("way_points")
                private List<Integer> wayPoints;
            }
        }
    }
}