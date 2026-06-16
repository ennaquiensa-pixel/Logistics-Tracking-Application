package com.logistics.route_service.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    public RouteCost calculateCost(double distanceKm, String vehicleType) {
        // Tarifs en Dirhams Marocains (MAD) pour le Maroc
        double fuelCostPerKm;
        double driverCostPerKm;

        switch (vehicleType.toLowerCase()) {
            case "standard":
                // Standard: 0.85 MAD/km carburant + 1.85 MAD/km main d'œuvre
                fuelCostPerKm = 0.85;    // MAD/km
                driverCostPerKm = 1.85;  // MAD/km
                break;
            case "premium":
                // Premium: tarifs majorés pour service premium
                fuelCostPerKm = 1.25;    // MAD/km
                driverCostPerKm = 3.70;  // MAD/km
                break;
            case "express":
                // Express: pour livraison rapide
                fuelCostPerKm = 1.10;    // MAD/km
                driverCostPerKm = 2.80;  // MAD/km
                break;
            default:
                // Économique par défaut
                fuelCostPerKm = 0.65;    // MAD/km
                driverCostPerKm = 1.50;  // MAD/km
        }

        double fuelCost = distanceKm * fuelCostPerKm;
        double driverCost = distanceKm * driverCostPerKm;
        double co2EmissionsKg = distanceKm * 0.188; // kg CO2 per km (valeur réaliste)
        double totalCost = fuelCost + driverCost;

        // Ajouter des frais fixes et marge bénéficiaire
        double fixedCost;
        double profitMargin;

        switch (vehicleType.toLowerCase()) {
            case "standard":
                fixedCost = 30.0;    // MAD
                profitMargin = 1.30; // +30%
                break;
            case "premium":
                fixedCost = 60.0;    // MAD
                profitMargin = 1.50; // +50%
                break;
            case "express":
                fixedCost = 45.0;    // MAD
                profitMargin = 1.40; // +40%
                break;
            default:
                fixedCost = 20.0;    // MAD
                profitMargin = 1.20; // +20%
        }

        // Coût total avec frais fixes et marge
        totalCost = (fuelCost + driverCost + fixedCost) * profitMargin;

        // Coût minimum de 50 MAD
        if (totalCost < 50.0) {
            totalCost = 50.0;
        }

        return new RouteCost(fuelCost, driverCost, totalCost, co2EmissionsKg);
    }

    public static class RouteCost {
        private final double fuelCost;       // en MAD
        private final double driverCost;     // en MAD
        private final double totalCost;      // en MAD
        private final double co2EmissionsKg; // en kg

        public RouteCost(double fuelCost, double driverCost, double totalCost, double co2EmissionsKg) {
            this.fuelCost = fuelCost;
            this.driverCost = driverCost;
            this.totalCost = totalCost;
            this.co2EmissionsKg = co2EmissionsKg;
        }

        public double getFuelCost() {
            return fuelCost;
        }

        public double getDriverCost() {
            return driverCost;
        }

        public double getTotalCost() {
            return totalCost;
        }

        public double getCo2EmissionsKg() {
            return co2EmissionsKg;
        }
    }
}