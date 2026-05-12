package com.brassam.helper.recipe;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_hops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeHop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long recipeId; // FK simple

    @Column(nullable = false)
    private Long hopId; // Identifiant de l'inventaire

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private HopPhase phase;

    private Integer duration;

    public enum HopPhase {
        BOIL, HOPSTAND, DRY_HOP
    }
}
