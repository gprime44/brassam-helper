package com.brassam.helper.style;

public record StyleDetailDto(
    Long id,
    String name,
    String category,
    String styleId,
    Double ogMin,
    Double ogMax,
    Double fgMin,
    Double fgMax,
    Double ibuMin,
    Double ibuMax,
    Double ebcMin,
    Double ebcMax,
    Double abvMin,
    Double abvMax,
    String notes,
    String aroma,
    String appearance,
    String flavor,
    String mouthfeel
) {}
