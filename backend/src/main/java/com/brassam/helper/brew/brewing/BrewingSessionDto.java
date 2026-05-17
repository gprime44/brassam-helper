package com.brassam.helper.brew.brewing;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BrewingSessionDto(
    Long id,
    String name,
    BrewingStatus status,
    String recipeName,
    LocalDate plannedDate,
    LocalDate brewDate
) {
    public record ReadingDto(
        Long id,
        LocalDateTime timestamp,
        Double gravity,
        Double temperature,
        String notes
    ) {}

    public record TaskDto(
        Long id,
        String label,
        boolean completed,
        BrewingTaskCategory category,
        int orderIndex
    ) {}

    public record BrewingSessionDetailDto(
        Long id,
        String name,
        BrewingStatus status,
        Long recipeId,
        LocalDate plannedDate,
        LocalDate brewDate,
        LocalDate bottlingDate,
        
        // Measurements
        Double preBoilVolume,
        Double preBoilGravity,
        Double batchVolume,
        Double originalGravity,
        Double finalGravity,
        
        // Calculated
        Double actualEfficiency,
        Double actualAbv,
        Double actualAttenuation,
        
        // Snapshot
        Double targetOg,
        Double targetFg,
        Double targetIbu,
        Double targetEbc,
        Double targetAbv,
        Double targetBatchSize,
        
        List<TaskDto> tasks,
        List<ReadingDto> readings
    ) {}
}
