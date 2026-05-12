package com.brassam.helper.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeHopRepository extends JpaRepository<RecipeHop, Long> {
    List<RecipeHop> findAllByRecipeId(Long recipeId);
}
