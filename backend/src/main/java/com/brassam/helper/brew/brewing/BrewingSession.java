package com.brassam.helper.brew.brewing;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "brewing_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrewingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BrewingStatus status;

    @Column(name = "recipe_id", nullable = false)
    private Long recipeId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private LocalDate plannedDate;
    private LocalDate brewDate;
    private LocalDate bottlingDate;
    private LocalDate endDate;

    // Measurements
    private Double preBoilVolume;
    private Double preBoilGravity;
    private Double batchVolume;
    private Double originalGravity;
    private Double finalGravity;

    // Calculated
    private Double actualEfficiency;
    private Double actualAbv;
    private Double actualAttenuation;

    // Snapshot
    private Double targetOg;
    private Double targetFg;
    private Double targetIbu;
    private Double targetEbc;
    private Double targetAbv;
    private Double targetBatchSize;
    private Integer targetBoilTime;
}
