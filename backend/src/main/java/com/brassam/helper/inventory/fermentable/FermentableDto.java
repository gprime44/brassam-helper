package com.brassam.helper.inventory.fermentable;

import lombok.Data;

@Data
public class FermentableDto {
    private Long id;
    private String name;
    private FermentableType type;
    private Double colorEbc;
    private Double yieldPercentage;
    private Double protein;
}
