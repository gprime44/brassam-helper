package com.brassam.helper.recipe;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public List<RecipeDto> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{externalId}")
    public RecipeDto getRecipe(@PathVariable UUID externalId) {
        return recipeService.getRecipeByExternalId(externalId);
    }

    @PostMapping
    public RecipeDto createRecipe(@RequestBody RecipeDto recipeDto) {
        return recipeService.createRecipeHeader(recipeDto);
    }

    @PutMapping("/{externalId}")
    public RecipeDto updateRecipe(@PathVariable UUID externalId, @RequestBody RecipeDto recipeDto) {
        return recipeService.updateRecipeHeader(externalId, recipeDto);
    }

    // Fermentables
    @PostMapping("/{externalId}/fermentables")
    public RecipeDto addFermentable(@PathVariable UUID externalId, @RequestBody RecipeDto.RecipeFermentableDto dto) {
        return recipeService.addFermentable(externalId, dto);
    }

    @PutMapping("/{externalId}/fermentables/{ingredientId}")
    public RecipeDto updateFermentable(@PathVariable UUID externalId, @PathVariable Long ingredientId, @RequestBody RecipeDto.RecipeFermentableDto dto) {
        return recipeService.updateFermentable(externalId, ingredientId, dto);
    }

    @DeleteMapping("/{externalId}/fermentables/{ingredientId}")
    public RecipeDto deleteFermentable(@PathVariable UUID externalId, @PathVariable Long ingredientId) {
        return recipeService.deleteFermentable(externalId, ingredientId);
    }

    // Hops
    @PostMapping("/{externalId}/hops")
    public RecipeDto addHop(@PathVariable UUID externalId, @RequestBody RecipeDto.RecipeHopDto dto) {
        return recipeService.addHop(externalId, dto);
    }

    @PutMapping("/{externalId}/hops/{ingredientId}")
    public RecipeDto updateHop(@PathVariable UUID externalId, @PathVariable Long ingredientId, @RequestBody RecipeDto.RecipeHopDto dto) {
        return recipeService.updateHop(externalId, ingredientId, dto);
    }

    @DeleteMapping("/{externalId}/hops/{ingredientId}")
    public RecipeDto deleteHop(@PathVariable UUID externalId, @PathVariable Long ingredientId) {
        return recipeService.deleteHop(externalId, ingredientId);
    }

    // Yeast
    @PutMapping("/{externalId}/yeast")
    public RecipeDto updateYeast(@PathVariable UUID externalId, @RequestBody RecipeDto.RecipeYeastDto dto) {
        return recipeService.updateYeast(externalId, dto);
    }
}
