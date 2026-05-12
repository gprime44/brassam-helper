package com.brassam.helper.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeFermentableRepository extends JpaRepository<RecipeFermentable, Long> {
    List<RecipeFermentable> findAllByRecipeId(Long recipeId);
}
