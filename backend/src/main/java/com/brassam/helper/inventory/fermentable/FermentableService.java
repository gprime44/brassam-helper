package com.brassam.helper.brew.fermentable;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FermentableService {
    private final FermentableRepository repository;
    private final FermentableMapper mapper;

    public FermentableService(FermentableRepository repository, FermentableMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<FermentableDto> search(String name) {
        if (name == null || name.isBlank()) {
            return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
        }
        return repository.findByNameContainingIgnoreCase(name).stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
