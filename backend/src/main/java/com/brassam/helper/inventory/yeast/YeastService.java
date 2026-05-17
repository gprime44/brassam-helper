package com.brassam.helper.inventory.yeast;

import com.brassam.helper.exception.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class YeastService {
    private final YeastRepository repository;
    private final YeastMapper mapper;

    public YeastService(YeastRepository repository, YeastMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<YeastDto> search(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return repository.findAll(pageable).map(mapper::toDto);
        }
        return repository.findByNameContainingIgnoreCase(name, pageable).map(mapper::toDto);
    }

    public YeastDetailDto findById(Long id) {
        return repository.findById(id).map(mapper::toDetailDto).orElseThrow(() -> new EntityNotFoundException("Yeast", id));
    }

    public Yeast findByIdEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Yeast", id));
    }
}
