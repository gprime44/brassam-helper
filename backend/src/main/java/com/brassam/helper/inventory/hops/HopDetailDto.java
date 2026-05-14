package com.brassam.helper.inventory.hops;

public record HopDetailDto(
    Long id,
    String name,
    Double alphaAcid,
    String origin,
    Double betaAcid,
    String notes,
    String substitutes,
    Double totalOil,
    Double myrcene,
    Double humulene,
    Double cohumulone,
    Double caryophyllene,
    Double farnesene
) {}
