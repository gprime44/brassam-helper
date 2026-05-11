package com.brassam.helper.brew.fermentable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FermentableService {
    private final FermentableRepository repository;
    private final FermentableMapper mapper;

    public FermentableService(FermentableRepository repository, FermentableMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<FermentableDto> search(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return repository.findAll(pageable).map(mapper::toDto);
        }
        return repository.findByNameContainingIgnoreCase(name, pageable).map(mapper::toDto);
    }

    public FermentableDto findById(Long id) {
        return repository.findById(id).map(mapper::toDto).orElseThrow(() -> new RuntimeException("Fermentable not found"));
    }
}
