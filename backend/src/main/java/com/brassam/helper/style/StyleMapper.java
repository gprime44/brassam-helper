package com.brassam.helper.style;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StyleMapper {
    StyleDto toDto(Style entity);
    StyleDetailDto toDetailDto(Style entity);
}
