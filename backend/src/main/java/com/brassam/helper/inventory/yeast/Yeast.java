package com.brassam.helper.brew.yeast;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "yeasts")
@Data
public class Yeast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double attenuationMin;
    private Double attenuationMax;
    private String type;
    private Double alcoholTolerance;
}
