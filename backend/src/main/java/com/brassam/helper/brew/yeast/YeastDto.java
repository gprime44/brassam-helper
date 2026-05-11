package com.brassam.helper.brew.yeast;

import lombok.Data;

@Data
public class YeastDto {
    private Long id;
    private String name;
    private Double attenuationMin;
    private Double attenuationMax;
    private String type;
    private Double alcoholTolerance;
}
