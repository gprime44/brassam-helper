package com.brassam.helper.style;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "styles")
@Data
public class Style {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String category;
    private String styleId; // BJCP ID

    // Technical Ranges
    private Double ogMin;
    private Double ogMax;
    private Double fgMin;
    private Double fgMax;
    private Double ibuMin;
    private Double ibuMax;
    private Double ebcMin;
    private Double ebcMax;
    private Double abvMin;
    private Double abvMax;

    // Sensory details
    @Column(columnDefinition = "TEXT")
    private String notes;
    @Column(columnDefinition = "TEXT")
    private String aroma;
    @Column(columnDefinition = "TEXT")
    private String appearance;
    @Column(columnDefinition = "TEXT")
    private String flavor;
    @Column(columnDefinition = "TEXT")
    private String mouthfeel;
}
