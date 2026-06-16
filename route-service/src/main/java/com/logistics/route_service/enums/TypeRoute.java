package com.logistics.route_service.enums;

public enum TypeRoute {
    AUTOROUTE,
    NATIONALE,
    DEPARTEMENTALE,
    URBAINE,
    MIXTE;

    public static TypeRoute fromValue(int value) {
        TypeRoute[] values = TypeRoute.values();
        if (value < 0 || value >= values.length) {
            throw new IllegalArgumentException("Invalid TypeRoute value: " + value);
        }
        return values[value];
    }
}
