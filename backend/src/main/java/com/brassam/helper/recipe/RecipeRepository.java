package com.brassam.helper.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findAllByUserId(Long userId);
    Optional<Recipe> findByExternalIdAndUserId(UUID externalId, Long userId);
}
