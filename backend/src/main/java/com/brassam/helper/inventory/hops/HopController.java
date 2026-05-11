package com.brassam.helper.brew.hops;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hops")
public class HopController {
    private final HopService service;

    public HopController(HopService service) {
        this.service = service;
    }

    @GetMapping
    public List<HopDto> search(@RequestParam(required = false) String name) {
        return service.search(name);
    }
}
