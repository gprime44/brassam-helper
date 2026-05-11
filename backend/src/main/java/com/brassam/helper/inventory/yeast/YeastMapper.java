package com.brassam.helper.inventory.yeast;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface YeastMapper {
    YeastDto toDto(Yeast entity);
    Yeast toEntity(YeastDto dto);
}
