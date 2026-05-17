package com.brassam.helper.recipe;

import java.util.List;
import java.util.UUID;

public record RecipeDto(
    UUID externalId,
    String name,
    String description,
    Double batchVolume,
    Double efficiency,
    Integer boilTime,
    Double og,
    Double fg,
    Double abv,
    Double ibu,
    Double ebc,
    List<RecipeFermentableDto> fermentables,
    List<RecipeHopDto> hops,
    List<RecipeMashStepDto> mashSteps,
    RecipeYeastDto yeast
) {
    public record RecipeFermentableDto(
        Long id,
        Long fermentableId,
        Double amount
    ) {}

    public record RecipeHopDto(
        Long id,
        Long hopId,
        Double amount,
        String phase,
        Integer duration
    ) {}

    public record RecipeMashStepDto(
        Long id,
        String name,
        Double temperature,
        Integer duration,
        Integer stepOrder
    ) {}

    public record RecipeYeastDto(
        Long yeastId,
        Double amount
    ) {}
}
