package com.brassam.helper.brew.fermentable;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fermentables")
public class FermentableController {
    private final FermentableService service;

    public FermentableController(FermentableService service) {
        this.service = service;
    }

    @GetMapping
    public List<FermentableDto> search(@RequestParam(required = false) String name) {
        return service.search(name);
    }
}
