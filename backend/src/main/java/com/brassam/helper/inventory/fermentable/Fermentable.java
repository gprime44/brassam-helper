package com.brassam.helper.inventory.fermentable;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fermentables")
@Data
public class Fermentable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private FermentableType type;
    private Double colorEbc;
    private Double yieldPercentage;
    private Double protein;
}
