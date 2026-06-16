package com.logistics.route_service.dtos.ORS;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ORSDirectionsRequest {
    @JsonProperty("coordinates")
    private List<List<Double>> coordinates;

    @JsonProperty("instructions")
    private boolean instructions = true;

    @JsonProperty("geometry")
    private boolean geometry = true;

    @JsonProperty("geometry_simplify")
    private boolean geometrySimplify = false;

    @JsonProperty("preference")
    private String preference = "shortest"; // shortest, fastest, recommended

    @JsonProperty("units")
    private String units = "km";

    @JsonProperty("language")
    private String language = "fr";

    @JsonProperty("roundabout_exits")
    private boolean roundaboutExits = true;

    @JsonProperty("attributes")
    private List<String> attributes = List.of("avgspeed", "percentage");

    @JsonProperty("elevation")
    private boolean elevation = false;

    @JsonProperty("options")
    private Options options;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Options {
        @JsonProperty("avoid_features")
        private List<String> avoidFeatures;

        @JsonProperty("avoid_countries")
        private List<String> avoidCountries;

        @JsonProperty("vehicle_type")
        private String vehicleType = "hgv"; // hgv, truck, bus, etc.

        @JsonProperty("profile_params")
        private ProfileParams profileParams;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileParams {
        @JsonProperty("weightings")
        private Weightings weightings;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Weightings {
        @JsonProperty("steepness_difficulty")
        private Integer steepnessDifficulty = 4;
    }
}