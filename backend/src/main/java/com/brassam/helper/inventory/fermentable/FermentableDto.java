package com.brassam.helper.inventory.fermentable;

public record FermentableDto(
    Long id,
    String name,
    FermentableType type,
    Double colorEbc,
    Double yieldPercentage,
    Double protein
) {}
