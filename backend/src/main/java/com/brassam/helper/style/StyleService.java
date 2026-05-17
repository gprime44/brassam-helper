package com.brassam.helper.style;

import com.brassam.helper.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StyleService {
    private final StyleRepository repository;
    private final StyleMapper mapper;

    public Page<StyleDto> search(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return repository.findAll(pageable).map(mapper::toDto);
        }
        return repository.findByNameContainingIgnoreCase(name, pageable).map(mapper::toDto);
    }

    public StyleDetailDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDetailDto)
                .orElseThrow(() -> new EntityNotFoundException("Style", id));
    }
}
