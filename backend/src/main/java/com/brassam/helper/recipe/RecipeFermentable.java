package com.brassam.helper.recipe;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_fermentables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeFermentable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long recipeId; // FK simple au lieu de @ManyToOne

    @Column(nullable = false)
    private Long fermentableId; // Identifiant de l'inventaire

    @Column(nullable = false)
    private Double amount;
}
