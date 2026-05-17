package com.brassam.helper.recipe;

import com.brassam.helper.auth.User;
import com.brassam.helper.auth.UserRepository;
import com.brassam.helper.exception.EntityNotFoundException;
import com.brassam.helper.exception.UnauthorizedException;
import com.brassam.helper.inventory.fermentable.FermentableService;
import com.brassam.helper.inventory.hops.HopService;
import com.brassam.helper.inventory.yeast.YeastService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final RecipeMashStepRepository mashStepRepository;
    
    private final BrewingCalculator brewingCalculator;
    
    private final FermentableService fermentableService;
    private final HopService hopService;
    private final YeastService yeastService;

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RecipeDto> getAllRecipes() {
        User user = getCurrentUser();
        return recipeRepository.findAllByUserId(user.getId()).stream()
                .map(this::enrichAndMap)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeByExternalId(UUID externalId) {
        User user = getCurrentUser();
        return recipeRepository.findByExternalIdAndUserId(externalId, user.getId())
                .map(this::enrichAndMap)
                .orElseThrow(() -> new EntityNotFoundException("Recipe", externalId));
    }

    @Transactional
    public RecipeDto createRecipeHeader(RecipeDto recipeDto) {
        User user = getCurrentUser();
        Recipe recipe = Recipe.builder()
                .name(recipeDto.name())
                .description(recipeDto.description())
                .batchVolume(recipeDto.batchVolume())
                .efficiency(recipeDto.efficiency())
                .boilTime(recipeDto.boilTime() != null ? recipeDto.boilTime() : 60)
                .userId(user.getId())
                .build();
        
        return enrichAndMap(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeDto updateRecipeHeader(UUID externalId, RecipeDto dto) {
        Recipe recipe = findEntityByExternalId(externalId);
        
        recipe.setName(dto.name());
        recipe.setDescription(dto.description());
        recipe.setBatchVolume(dto.batchVolume());
        recipe.setEfficiency(dto.efficiency());
        if (dto.boilTime() != null) recipe.setBoilTime(dto.boilTime());
        
        return enrichAndMap(recipeRepository.save(recipe));
    }

    // Fermentables
    @Transactional
    public RecipeDto addFermentable(UUID recipeExternalId, RecipeDto.RecipeFermentableDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        fermentableService.findById(dto.fermentableId());
        
        fermentableRepository.save(RecipeFermentable.builder()
                .recipeId(recipe.getId())
                .fermentableId(dto.fermentableId())
                .amount(dto.amount())
                .build());
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto updateFermentable(UUID recipeExternalId, Long ingredientId, RecipeDto.RecipeFermentableDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId); // Validation de propriété incluse
        RecipeFermentable fermentable = fermentableRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient", ingredientId));
        
        // On s'assure que l'ingrédient appartient bien à la recette de l'utilisateur
        if (!fermentable.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Ingredient does not belong to this recipe");
        }

        fermentable.setAmount(dto.amount());
        fermentableRepository.save(fermentable);
        
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto deleteFermentable(UUID recipeExternalId, Long ingredientId) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeFermentable fermentable = fermentableRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient", ingredientId));

        if (!fermentable.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Ingredient does not belong to this recipe");
        }

        fermentableRepository.deleteById(ingredientId);
        return enrichAndMap(recipe);
    }

    // Hops
    @Transactional
    public RecipeDto addHop(UUID recipeExternalId, RecipeDto.RecipeHopDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        hopService.findById(dto.hopId());
        
        hopRepository.save(RecipeHop.builder()
                .recipeId(recipe.getId())
                .hopId(dto.hopId())
                .amount(dto.amount())
                .phase(RecipeHop.HopPhase.valueOf(dto.phase()))
                .duration(dto.duration())
                .build());
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto updateHop(UUID recipeExternalId, Long ingredientId, RecipeDto.RecipeHopDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeHop hop = hopRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient", ingredientId));
        
        if (!hop.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Ingredient does not belong to this recipe");
        }

        hop.setAmount(dto.amount());
        hop.setPhase(RecipeHop.HopPhase.valueOf(dto.phase()));
        hop.setDuration(dto.duration());
        hopRepository.save(hop);
        
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto deleteHop(UUID recipeExternalId, Long ingredientId) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeHop hop = hopRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient", ingredientId));

        if (!hop.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Ingredient does not belong to this recipe");
        }

        hopRepository.deleteById(ingredientId);
        return enrichAndMap(recipe);
    }

    // Yeast
    @Transactional
    public RecipeDto updateYeast(UUID recipeExternalId, RecipeDto.RecipeYeastDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        yeastRepository.deleteByRecipeId(recipe.getId());
        yeastRepository.flush();
        
        if (dto != null) {
            yeastService.findById(dto.yeastId());
            
            yeastRepository.save(RecipeYeast.builder()
                    .recipeId(recipe.getId())
                    .yeastId(dto.yeastId())
                    .amount(dto.amount())
                    .build());
        }
        return enrichAndMap(recipe);
    }

    // Mash Steps
    @Transactional
    public RecipeDto addMashStep(UUID recipeExternalId, RecipeDto.RecipeMashStepDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        
        mashStepRepository.save(RecipeMashStep.builder()
                .recipeId(recipe.getId())
                .name(dto.name())
                .temperature(dto.temperature())
                .duration(dto.duration())
                .stepOrder(dto.stepOrder())
                .build());
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto updateMashStep(UUID recipeExternalId, Long stepId, RecipeDto.RecipeMashStepDto dto) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeMashStep step = mashStepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("Mash Step", stepId));

        if (!step.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Mash Step does not belong to this recipe");
        }

        step.setName(dto.name());
        step.setTemperature(dto.temperature());
        step.setDuration(dto.duration());
        mashStepRepository.save(step);
        
        return enrichAndMap(recipe);
    }

    @Transactional
    public RecipeDto deleteMashStep(UUID recipeExternalId, Long stepId) {
        Recipe recipe = findEntityByExternalId(recipeExternalId);
        RecipeMashStep step = mashStepRepository.findById(stepId)
                .orElseThrow(() -> new EntityNotFoundException("Mash Step", stepId));

        if (!step.getRecipeId().equals(recipe.getId())) {
            throw new UnauthorizedException("Mash Step does not belong to this recipe");
        }

        mashStepRepository.deleteById(stepId);
        return enrichAndMap(recipe);
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    private Recipe findEntityByExternalId(UUID externalId) {
        User user = getCurrentUser();
        return recipeRepository.findByExternalIdAndUserId(externalId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Recipe", externalId));
    }

    private RecipeDto enrichAndMap(Recipe recipe) {
        List<RecipeFermentable> fermentables = fermentableRepository.findAllByRecipeId(recipe.getId());
        List<RecipeHop> hops = hopRepository.findAllByRecipeId(recipe.getId());
        RecipeYeast yeast = yeastRepository.findByRecipeId(recipe.getId()).orElse(null);

        List<RecipeDto.RecipeFermentableDto> fermentableDtos = fermentables.stream()
                .map(f -> new RecipeDto.RecipeFermentableDto(f.getId(), f.getFermentableId(), f.getAmount()))
                .collect(Collectors.toList());
        
        List<RecipeDto.RecipeHopDto> hopDtos = hops.stream()
                .map(h -> new RecipeDto.RecipeHopDto(h.getId(), h.getHopId(), h.getAmount(), h.getPhase().name(), h.getDuration()))
                .collect(Collectors.toList());
        
        RecipeDto.RecipeYeastDto yeastDto = yeast != null ? new RecipeDto.RecipeYeastDto(yeast.getYeastId(), yeast.getAmount()) : null;

        // Moteur de calcul
        List<BrewingCalculator.FermentableCalc> fermentableCalcs = fermentables.stream().map(f -> {
            var inv = fermentableService.findById(f.getFermentableId());
            return new BrewingCalculator.FermentableCalc(f.getAmount(), inv.colorEbc(), inv.yieldPercentage());
        }).collect(Collectors.toList());

        List<BrewingCalculator.HopCalc> hopCalcs = hops.stream().map(h -> {
            var inv = hopService.findById(h.getHopId());
            return new BrewingCalculator.HopCalc(h.getAmount(), inv.alphaAcid(), h.getPhase().name(), h.getDuration());
        }).collect(Collectors.toList());

        Double attenuation = 75.0;
        if (yeast != null) {
            var inv = yeastService.findById(yeast.getYeastId());
            attenuation = inv.attenuationMax();
        }

        Double og = brewingCalculator.calculateOg(fermentableCalcs, recipe.getBatchVolume(), recipe.getEfficiency());
        Double fg = brewingCalculator.calculateFg(og, attenuation);
        Double abv = (og - fg) * 131.25;
        Double ibu = brewingCalculator.calculateIbu(hopCalcs, og, recipe.getBatchVolume());
        Double ebc = brewingCalculator.calculateEbc(fermentableCalcs, recipe.getBatchVolume());

        List<RecipeDto.RecipeMashStepDto> mashStepDtos = mashStepRepository.findAllByRecipeIdOrderByStepOrderAsc(recipe.getId()).stream()
                .map(m -> new RecipeDto.RecipeMashStepDto(m.getId(), m.getName(), m.getTemperature(), m.getDuration(), m.getStepOrder()))
                .collect(Collectors.toList());

        return new RecipeDto(
            recipe.getExternalId(),
            recipe.getName(),
            recipe.getDescription(),
            recipe.getBatchVolume(),
            recipe.getEfficiency(),
            recipe.getBoilTime(),
            og, fg, abv, ibu, ebc,
            fermentableDtos,
            hopDtos,
            mashStepDtos,
            yeastDto
        );
    }
}
