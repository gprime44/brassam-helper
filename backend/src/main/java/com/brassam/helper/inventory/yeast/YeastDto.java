package com.brassam.helper.inventory.yeast;

public record YeastDto(
    Long id,
    String name,
    Double attenuationMin,
    Double attenuationMax,
    YeastType type,
    Double alcoholTolerance
) {}
