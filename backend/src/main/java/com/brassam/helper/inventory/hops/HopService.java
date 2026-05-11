package com.brassam.helper.brew.hops;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class HopService {
    private final HopRepository repository;
    private final HopMapper mapper;

    public HopService(HopRepository repository, HopMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<HopDto> search(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return repository.findAll(pageable).map(mapper::toDto);
        }
        return repository.findByNameContainingIgnoreCase(name, pageable).map(mapper::toDto);
    }

    public HopDto findById(Long id) {
        return repository.findById(id).map(mapper::toDto).orElseThrow(() -> new RuntimeException("Hop not found"));
    }
}
