package com.brassam.helper.brew.fermentable;

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
    private String type;
    private Double colorEbc;
    private Double yieldPercentage;
    private Double protein;
}
