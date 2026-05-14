package com.brassam.helper.inventory.yeast;

public record YeastDetailDto(
    Long id,
    String name,
    Double attenuationMin,
    Double attenuationMax,
    YeastType type,
    Double alcoholTolerance,
    String producer,
    String productId,
    String flocculation,
    Double tempMin,
    Double tempMax,
    String notes,
    String bestFor
) {}
