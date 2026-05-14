package com.brassam.helper.inventory.fermentable;

public record FermentableDetailDto(
    Long id,
    String name,
    FermentableType type,
    Double colorEbc,
    Double yieldPercentage,
    Double protein,
    String producer,
    String origin,
    String notes,
    Double moisture,
    Double diastaticPower,
    Double fan,
    Double betaGlucan
) {}
