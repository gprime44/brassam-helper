package com.brassam.helper.brew.hops;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HopService {
    private final HopRepository repository;
    private final HopMapper mapper;

    public HopService(HopRepository repository, HopMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<HopDto> search(String name) {
        if (name == null || name.isBlank()) {
            return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
        }
        return repository.findByNameContainingIgnoreCase(name).stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
