package com.brassam.helper.inventory.yeast;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/yeasts")
public class YeastController {
    private final YeastService service;

    public YeastController(YeastService service) {
        this.service = service;
    }

    @GetMapping
    public Page<YeastDto> search(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return service.search(name, pageable);
    }

    @GetMapping("/{id}")
    public YeastDto getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
