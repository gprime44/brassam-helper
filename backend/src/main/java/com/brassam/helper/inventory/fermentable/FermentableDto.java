package com.brassam.helper.brew.fermentable;

import lombok.Data;

@Data
public class FermentableDto {
    private Long id;
    private String name;
    private String type;
    private Double colorEbc;
    private Double yieldPercentage;
    private Double protein;
}
