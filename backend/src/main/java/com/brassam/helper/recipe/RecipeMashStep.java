package com.brassam.helper.recipe;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipe_mash_steps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeMashStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipe_id", nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;
}
