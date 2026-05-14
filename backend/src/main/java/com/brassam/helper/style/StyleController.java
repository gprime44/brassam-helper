package com.brassam.helper.style;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/styles")
@RequiredArgsConstructor
public class StyleController {
    private final StyleService service;

    @GetMapping
    public Page<StyleDto> search(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return service.search(name, pageable);
    }

    @GetMapping("/{id}")
    public StyleDetailDto getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
