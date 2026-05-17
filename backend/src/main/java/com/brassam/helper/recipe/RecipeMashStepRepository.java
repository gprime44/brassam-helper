package com.brassam.helper.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeMashStepRepository extends JpaRepository<RecipeMashStep, Long> {
    List<RecipeMashStep> findAllByRecipeIdOrderByStepOrderAsc(Long recipeId);
}
