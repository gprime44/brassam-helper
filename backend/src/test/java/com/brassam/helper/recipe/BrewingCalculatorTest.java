package com.brassam.helper.recipe;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

class BrewingCalculatorTest {

    private final BrewingCalculator calculator = new BrewingCalculator();

    @Test
    void shouldCalculateEbcCorrecty() {
        var pils = new BrewingCalculator.FermentableCalc(5000.0, 4.0, 80.0);
        double ebc = calculator.calculateEbc(List.of(pils), 20.0);
        assertTrue(ebc > 0 && ebc < 5);
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
