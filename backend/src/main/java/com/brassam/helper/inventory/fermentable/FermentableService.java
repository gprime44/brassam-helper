package com.brassam.helper.inventory.fermentable;

import com.brassam.helper.exception.EntityNotFoundException;
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

    public FermentableDetailDto findById(Long id) {
        return repository.findById(id).map(mapper::toDetailDto).orElseThrow(() -> new EntityNotFoundException("Fermentable", id));
    }

    public Fermentable findByIdEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Fermentable", id));
    }
}
