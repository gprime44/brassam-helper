package com.brassam.helper.recipe;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_yeasts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeYeast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long recipeId; // FK simple

    @Column(nullable = false)
    private Long yeastId; // Identifiant de l'inventaire

    private Double amount;
}
