package com.brassam.helper.brew.yeast;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YeastService {
    private final YeastRepository repository;
    private final YeastMapper mapper;

    public YeastService(YeastRepository repository, YeastMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<YeastDto> search(String name) {
        if (name == null || name.isBlank()) {
            return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
        }
        return repository.findByNameContainingIgnoreCase(name).stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
