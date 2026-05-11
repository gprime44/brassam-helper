package com.brassam.helper.brew.hops;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HopMapper {
    HopDto toDto(Hop entity);
    Hop toEntity(HopDto dto);
}
