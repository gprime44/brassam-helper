package com.brassam.helper.recipe;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID externalId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Builder.Default
    private Double batchVolume = 20.0;

    @Builder.Default
    private Double efficiency = 75.0;

    @PrePersist
    protected void onCreate() {
        if (externalId == null) {
            externalId = UUID.randomUUID();
        }
    }
}
