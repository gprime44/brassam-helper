package com.brassam.helper.inventory.fermentable;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FermentableMapper {
    FermentableDto toDto(Fermentable entity);
    FermentableDetailDto toDetailDto(Fermentable entity);
}
