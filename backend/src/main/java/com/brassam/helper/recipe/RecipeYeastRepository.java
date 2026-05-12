package com.brassam.helper.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface RecipeYeastRepository extends JpaRepository<RecipeYeast, Long> {
    Optional<RecipeYeast> findByRecipeId(Long recipeId);

    @Modifying
    @Transactional
    void deleteByRecipeId(Long recipeId);
}
