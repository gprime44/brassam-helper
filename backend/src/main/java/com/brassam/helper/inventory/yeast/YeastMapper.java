package com.brassam.helper.brew.yeast;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface YeastMapper {
    YeastDto toDto(Yeast entity);
    Yeast toEntity(YeastDto dto);
}
