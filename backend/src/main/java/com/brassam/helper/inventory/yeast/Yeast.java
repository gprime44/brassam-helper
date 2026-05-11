package com.brassam.helper.inventory.yeast;

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
    @Enumerated(EnumType.STRING)
    private YeastType type;
    private Double alcoholTolerance;
}
