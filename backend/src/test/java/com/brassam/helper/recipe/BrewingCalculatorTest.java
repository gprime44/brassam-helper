package com.brassam.helper.recipe;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

class BrewingCalculatorTest {

    private final BrewingCalculator calculator = new BrewingCalculator();

    @Test
    void shouldCalculateEbcCorrecty() {
        // Pale malt 7 EBC, 5kg, 20L
        // MCU (US) = (5 * 2.204) * (7 / 1.97) / (20 * 0.26417)
        // MCU (US) = 11.02 * 3.55 / 5.28 = 7.41
        // SRM = 1.4922 * (7.41 ^ 0.6859) = 1.4922 * 3.94 = 5.88
        // EBC = 5.88 * 1.97 = 11.58
        
        var pale = new BrewingCalculator.FermentableCalc(5000.0, 7.0, 80.0);
        double ebc = calculator.calculateEbc(List.of(pale), 20.0);
        
        // Expected value is roughly 11.6 EBC with Morey formula
        // Current implementation gives roughly 2.1 EBC (bug)
        assertEquals(11.58, ebc, 0.5);
    }

    @Test
    void shouldCalculateOgCorrectly() {
        var pils = new BrewingCalculator.FermentableCalc(5000.0, 4.0, 80.0);
        double og = calculator.calculateOg(List.of(pils), 20.0, 75.0);
        assertEquals(1.0579, og, 0.001);
    }

    @Test
    void shouldCalculateIbuCorrectly() {
        var saaz = new BrewingCalculator.HopCalc(30.0, 3.5, "BOIL", 60);
        double ibu = calculator.calculateIbu(List.of(saaz), 1.050, 20.0);
        assertEquals(12.11, ibu, 0.01);
    }
}
