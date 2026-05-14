package com.brassam.helper.inventory.hops;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hops")
@Data
public class Hop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double alphaAcid;
    private String origin;

    // Nouveaux champs pour le détail
    private Double betaAcid;
    @Column(columnDefinition = "TEXT")
    private String notes;
    private String substitutes;
    private Double totalOil;
    private Double myrcene;
    private Double humulene;
    private Double cohumulone;
    private Double caryophyllene;
    private Double farnesene;
}
