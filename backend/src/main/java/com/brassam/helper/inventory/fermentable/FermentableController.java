package com.brassam.helper.inventory.fermentable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fermentables")
public class FermentableController {
    private final FermentableService service;

    public FermentableController(FermentableService service) {
        this.service = service;
    }

    @GetMapping
    public Page<FermentableDto> search(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return service.search(name, pageable);
    }

    @GetMapping("/{id}")
    public FermentableDto getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
