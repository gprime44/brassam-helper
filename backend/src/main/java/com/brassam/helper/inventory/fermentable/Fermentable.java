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
    
    // Nouveaux champs pour le détail
    private String producer;
    private String origin;
    @Column(columnDefinition = "TEXT")
    private String notes;
    private Double moisture;
    private Double diastaticPower;
    private Double fan;
    private Double betaGlucan;
}
