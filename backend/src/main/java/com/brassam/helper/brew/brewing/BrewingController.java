package com.brassam.helper.brew.brewing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/brewing")
@RequiredArgsConstructor
public class BrewingController {

    private final BrewingService brewingService;

    @PostMapping("/start/{recipeExternalId}")
    public ResponseEntity<Long> startSession(@PathVariable UUID recipeExternalId) {
        BrewingSession session = brewingService.startSession(recipeExternalId);
        return ResponseEntity.ok(session.getId());
    }

    @GetMapping
    public ResponseEntity<List<BrewingSessionDto>> getSessions() {
        return ResponseEntity.ok(brewingService.getSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrewingSessionDto.BrewingSessionDetailDto> getSessionDetail(@PathVariable Long id) {
        return ResponseEntity.ok(brewingService.getSessionDetail(id));
    }

    @PatchMapping("/tasks/{taskId}/toggle")
    public ResponseEntity<Void> toggleTask(@PathVariable Long taskId) {
        brewingService.toggleTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/readings")
    public ResponseEntity<Void> addReading(@PathVariable Long id, @RequestBody BrewingSessionDto.ReadingDto dto) {
        brewingService.addReading(id, dto);
        return ResponseEntity.noContent().build();
    }
}
