package com.brassam.helper.brew.yeast;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/yeasts")
public class YeastController {
    private final YeastService service;

    public YeastController(YeastService service) {
        this.service = service;
    }

    @GetMapping
    public List<YeastDto> search(@RequestParam(required = false) String name) {
        return service.search(name);
    }
}
