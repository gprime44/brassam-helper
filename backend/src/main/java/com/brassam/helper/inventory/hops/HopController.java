package com.brassam.helper.brew.hops;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hops")
public class HopController {
    private final HopService service;

    public HopController(HopService service) {
        this.service = service;
    }

    @GetMapping
    public Page<HopDto> search(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return service.search(name, pageable);
    }

    @GetMapping("/{id}")
    public HopDto getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
