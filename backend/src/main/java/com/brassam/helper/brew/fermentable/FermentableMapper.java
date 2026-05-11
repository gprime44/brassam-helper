package com.brassam.helper.brew.fermentable;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FermentableMapper {
    FermentableDto toDto(Fermentable entity);
    Fermentable toEntity(FermentableDto dto);
}
