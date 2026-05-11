package com.brassam.helper.inventory.yeast;

import lombok.Data;

@Data
public class YeastDto {
    private Long id;
    private String name;
    private Double attenuationMin;
    private Double attenuationMax;
    private YeastType type;
    private Double alcoholTolerance;
}
