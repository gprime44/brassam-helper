package com.brassam.helper.recipe;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {
    private UUID externalId;
    private String name;
    private String description;
    private Double batchVolume;
    private Double efficiency;
    
    private Double og;
    private Double fg;
    private Double abv;
    private Double ibu;
    private Double ebc;

    private List<RecipeFermentableDto> fermentables;
    private List<RecipeHopDto> hops;
    private RecipeYeastDto yeast;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeFermentableDto {
        private Long id; // Identifiant de la liaison
        private Long fermentableId; // Référence inventaire
        private Double amount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeHopDto {
        private Long id; // Identifiant de la liaison
        private Long hopId; // Référence inventaire
        private Double amount;
        private String phase;
        private Integer duration;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeYeastDto {
        private Long yeastId;
        private Double amount;
    }
}
