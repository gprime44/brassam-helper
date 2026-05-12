package com.brassam.helper.recipe;

import com.brassam.helper.inventory.fermentable.FermentableService;
import com.brassam.helper.inventory.hops.HopService;
import com.brassam.helper.inventory.yeast.YeastService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeFermentableRepository fermentableRepository;
    private final RecipeHopRepository hopRepository;
    private final RecipeYeastRepository yeastRepository;
    
    private final BrewingCalculator brewingCalculator;
    
    private final FermentableService fermentableService;
    private final HopService hopService;
    private final YeastService yeastService;

    @Transactional(readOnly = true)
    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::enrichAndMap)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeByExternalId(UUID externalId) {
        return recipeRepository.findByExternalId(externalId)
                .map(this::enrichAndMap)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    @Transactional
    public RecipeDto createRecipeHeader(RecipeDto recipeDto) {
        Recipe recipe = Recipe.builder()
                .name(recipeDto.getName())
                .description(recipeDto.getDescription())
                .batchVolume(recipeDto.getBatchVolume())
                .efficiency(recipeDto.getEfficiency())
                .build();
        
        return enrichAndMap(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeDto updateRecipeHeader(UUID externalId, RecipeDto dto) {
        Recipe recipe = findEntityByExternalId(externalId);
        
        recipe.setName(dto.getName());
        recipe.setDescription(dto.getDescription());
        recipe.setBatchVolume(dto.getBatchVolume());
        recipe.setEfficiency(dto.getEfficiency());
        
        return enrichAndMap(recipeRepository.save(recipe));
    }

    // Fermentables
    @Transactional
    public RecipeDto addFermentable(UUID recipeExternalId, RecipeDto.RecipeFermentableDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        // Validation d'existence dans l'inventaire
        fermentableService.findById(dto.getFermentableId());
        
        fermentableRepository.save(RecipeFermentable.builder()
                .recipeId(recipe.getId())
                .fermentableId(dto.getFermentableId())
                .amount(dto.getAmount())
                .build());
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto updateFermentable(UUID recipeExternalId, Long ingredientId, RecipeDto.RecipeFermentableDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeFermentable fermentable = fermentableRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        
        fermentable.setAmount(dto.getAmount());
        fermentableRepository.save(fermentable);
        
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto deleteFermentable(UUID recipeExternalId, Long ingredientId) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        fermentableRepository.deleteById(ingredientId);
        return enrichAndMap(recipe);
    }

    // Hops
    @Transactional
    public RecipeDto addHop(UUID recipeExternalId, RecipeDto.RecipeHopDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        // Validation d'existence dans l'inventaire
        hopService.findById(dto.getHopId());
        
        hopRepository.save(RecipeHop.builder()
                .recipeId(recipe.getId())
                .hopId(dto.getHopId())
                .amount(dto.getAmount())
                .phase(RecipeHop.HopPhase.valueOf(dto.getPhase()))
                .duration(dto.getDuration())
                .build());
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto updateHop(UUID recipeExternalId, Long ingredientId, RecipeDto.RecipeHopDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeHop hop = hopRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        
        hop.setAmount(dto.getAmount());
        hop.setPhase(RecipeHop.HopPhase.valueOf(dto.getPhase()));
        hop.setDuration(dto.getDuration());
        hopRepository.save(hop);
        
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto deleteHop(UUID recipeExternalId, Long ingredientId) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        hopRepository.deleteById(ingredientId);
        return enrichAndMap(recipe);
    }

    // Yeast
    @Transactional
    public RecipeDto updateYeast(UUID recipeExternalId, RecipeDto.RecipeYeastDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        // On supprime et on flush pour être sûr que la contrainte d'unicité ne bloque pas l'insertion suivante
        yeastRepository.deleteByRecipeId(recipe.getId());
        yeastRepository.flush();
        
        if (dto != null) {
            // Validation d'existence dans l'inventaire
            yeastService.findById(dto.getYeastId());
            
            yeastRepository.save(RecipeYeast.builder()
                    .recipeId(recipe.getId())
                    .yeastId(dto.getYeastId())
                    .amount(dto.getAmount())
                    .build());
        }
        return enrichAndMap(recipe);
    }

    private Recipe findEntityByExternalId(UUID externalId) {
        return recipeRepository.findByExternalId(externalId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    private RecipeDto enrichAndMap(Recipe recipe) {
        RecipeDto dto = RecipeDto.builder()
                .externalId(recipe.getExternalId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .batchVolume(recipe.getBatchVolume())
                .efficiency(recipe.getEfficiency())
                .build();
        
        List<RecipeFermentable> fermentables = fermentableRepository.findAllByRecipeId(recipe.getId());
        List<RecipeHop> hops = hopRepository.findAllByRecipeId(recipe.getId());
        RecipeYeast yeast = yeastRepository.findByRecipeId(recipe.getId()).orElse(null);

        dto.setFermentables(fermentables.stream()
                .map(f -> new RecipeDto.RecipeFermentableDto(f.getId(), f.getFermentableId(), f.getAmount()))
                .collect(Collectors.toList()));
        
        dto.setHops(hops.stream()
                .map(h -> new RecipeDto.RecipeHopDto(h.getId(), h.getHopId(), h.getAmount(), h.getPhase().name(), h.getDuration()))
                .collect(Collectors.toList()));
        
        if (yeast != null) {
            dto.setYeast(new RecipeDto.RecipeYeastDto(yeast.getYeastId(), yeast.getAmount()));
        }

        // Moteur de calcul
        List<BrewingCalculator.FermentableCalc> fermentableCalcs = fermentables.stream().map(f -> {
            var inv = fermentableService.findById(f.getFermentableId());
            return new BrewingCalculator.FermentableCalc(f.getAmount(), inv.getColorEbc(), inv.getYieldPercentage());
        }).collect(Collectors.toList());

        List<BrewingCalculator.HopCalc> hopCalcs = hops.stream().map(h -> {
            var inv = hopService.findById(h.getHopId());
            return new BrewingCalculator.HopCalc(h.getAmount(), inv.getAlphaAcid(), h.getPhase().name(), h.getDuration());
        }).collect(Collectors.toList());

        Double attenuation = 75.0;
        if (yeast != null) {
            var inv = yeastService.findById(yeast.getYeastId());
            attenuation = inv.getAttenuationMax();
        }

        dto.setOg(brewingCalculator.calculateOg(fermentableCalcs, dto.getBatchVolume(), dto.getEfficiency()));
        dto.setFg(brewingCalculator.calculateFg(dto.getOg(), attenuation));
        dto.setAbv((dto.getOg() - dto.getFg()) * 131.25);
        dto.setIbu(brewingCalculator.calculateIbu(hopCalcs, dto.getOg(), dto.getBatchVolume()));
        dto.setEbc(brewingCalculator.calculateEbc(fermentableCalcs, dto.getBatchVolume()));

        return dto;
    }
}
