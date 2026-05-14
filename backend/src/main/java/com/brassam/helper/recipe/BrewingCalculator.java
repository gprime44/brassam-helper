package com.brassam.helper.recipe;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class BrewingCalculator {

    public record FermentableCalc(Double amount, Double colorEbc, Double yieldPercentage) {}
    public record HopCalc(Double amount, Double alphaAcid, String phase, Integer duration) {}

    /**
     * Calcule l'EBC final d'une recette en utilisant la formule de Morey.
     * SRM = 1.4922 * (MCU ^ 0.6859)
     * MCU = (Poids_lbs * SRM_grain) / Volume_gal
     */
    public double calculateEbc(List<FermentableCalc> fermentables, double volumeLiters) {
        if (volumeLiters <= 0) return 0;
        
        // Conversion du volume en Gallons
        double volumeGallons = volumeLiters * 0.264172;
        
        // Calcul du MCU (Malt Color Units)
        double mcu = fermentables.stream()
                .mapToDouble(f -> {
                    double weightLbs = (f.amount() / 1000.0) * 2.20462;
                    double srmGrain = f.colorEbc() / 1.97;
                    return (weightLbs * srmGrain);
                })
                .sum() / volumeGallons;
        
        if (mcu <= 0) return 0;

        // Formule de Morey (valide jusqu'à ~50 SRM)
        double srm = 1.4922 * Math.pow(mcu, 0.6859);
        
        // Conversion finale en EBC
        return srm * 1.97;
    }

    public double calculateOg(List<FermentableCalc> fermentables, double volume, double efficiency) {
        if (volume <= 0) return 1.0;
        double points = fermentables.stream()
                .mapToDouble(f -> (f.amount() / 1000.0) * (f.yieldPercentage() / 100.0) * (efficiency / 100.0) * 386.0)
                .sum() / volume;
        return 1 + (points / 1000.0);
    }

    public double calculateFg(double og, double attenuation) {
        return 1 + ((og - 1) * (1 - attenuation / 100.0));
    }

    public double calculateIbu(List<HopCalc> hops, double og, double volume) {
        if (volume <= 0) return 0;
        return hops.stream()
                .filter(h -> "BOIL".equals(h.phase()))
                .mapToDouble(h -> calculateTinseth(h.amount(), h.alphaAcid(), h.duration(), og, volume))
                .sum();
    }

    private double calculateTinseth(double amount, double alpha, int time, double og, double volume) {
        double bignessFactor = 1.65 * Math.pow(0.000125, og - 1);
        double timeFactor = (1 - Math.exp(-0.04 * time)) / 4.15;
        double utilization = bignessFactor * timeFactor;
        return (amount * (alpha / 100.0) * utilization * 1000) / volume;
    }
}
