package com.brassam.helper.style;

public record StyleDto(
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
    Double abvMax
) {}
