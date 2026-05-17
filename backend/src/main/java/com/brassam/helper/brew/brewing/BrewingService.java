package com.brassam.helper.brew.brewing;

import com.brassam.helper.auth.User;
import com.brassam.helper.auth.UserRepository;
import com.brassam.helper.exception.EntityNotFoundException;
import com.brassam.helper.exception.UnauthorizedException;
import com.brassam.helper.recipe.Recipe;
import com.brassam.helper.recipe.RecipeDto;
import com.brassam.helper.recipe.RecipeRepository;
import com.brassam.helper.recipe.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BrewingService {

    private final BrewingSessionRepository sessionRepository;
    private final BrewingTaskRepository taskRepository;
    private final FermentationReadingRepository readingRepository;
    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional
    public BrewingSession startSession(UUID recipeExternalId) {
        User user = getCurrentUser();
        RecipeDto recipeDto = recipeService.getRecipeByExternalId(recipeExternalId);
        Recipe recipe = recipeRepository.findByExternalId(recipeExternalId)
                .orElseThrow(() -> new EntityNotFoundException("Recipe", recipeExternalId));

        BrewingSession session = BrewingSession.builder()
                .name(recipe.getName() + " - " + LocalDate.now())
                .status(BrewingStatus.PLANNED)
                .recipeId(recipe.getId())
                .userId(user.getId())
                .plannedDate(LocalDate.now())
                // Snapshot targets
                .targetOg(recipeDto.og())
                .targetFg(recipeDto.fg())
                .targetAbv(recipeDto.abv())
                .targetIbu(recipeDto.ibu())
                .targetEbc(recipeDto.ebc())
                .targetBatchSize(recipeDto.batchVolume())
                .targetBoilTime(recipeDto.boilTime())
                .build();

        BrewingSession savedSession = sessionRepository.save(session);
        generateDefaultTasks(savedSession, recipeDto);
        
        return savedSession;
    }

    @Transactional(readOnly = true)
    public List<BrewingSessionDto> getSessions() {
        User user = getCurrentUser();
        return sessionRepository.findByUserId(user.getId()).stream()
                .map(s -> {
                    String recipeName = recipeRepository.findById(s.getRecipeId())
                            .map(Recipe::getName)
                            .orElse("Unknown Recipe");
                    return new BrewingSessionDto(s.getId(), s.getName(), s.getStatus(), recipeName, s.getPlannedDate(), s.getBrewDate());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public BrewingSessionDto.BrewingSessionDetailDto getSessionDetail(Long id) {
        User user = getCurrentUser();
        BrewingSession s = sessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BrewingSession", id));
        
        if (!s.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied to this session");
        }

        List<BrewingSessionDto.TaskDto> tasks = taskRepository.findByBrewingSessionIdOrderByOrderIndexAsc(s.getId()).stream()
                .map(t -> new BrewingSessionDto.TaskDto(t.getId(), t.getLabel(), t.isCompleted(), t.getCategory(), t.getOrderIndex()))
                .toList();

        List<BrewingSessionDto.ReadingDto> readings = readingRepository.findByBrewingSessionIdOrderByTimestampDesc(s.getId()).stream()
                .map(r -> new BrewingSessionDto.ReadingDto(r.getId(), r.getTimestamp(), r.getGravity(), r.getTemperature(), r.getNotes()))
                .toList();

        return new BrewingSessionDto.BrewingSessionDetailDto(
                s.getId(), s.getName(), s.getStatus(), s.getRecipeId(), s.getPlannedDate(), s.getBrewDate(), s.getBottlingDate(),
                s.getPreBoilVolume(), s.getPreBoilGravity(), s.getBatchVolume(), s.getOriginalGravity(), s.getFinalGravity(),
                s.getActualEfficiency(), s.getActualAbv(), s.getActualAttenuation(),
                s.getTargetOg(), s.getTargetFg(), s.getTargetIbu(), s.getTargetEbc(), s.getTargetAbv(), s.getTargetBatchSize(),
                tasks, readings
        );
    }

    @Transactional
    public void addReading(Long sessionId, BrewingSessionDto.ReadingDto dto) {
        User user = getCurrentUser();
        BrewingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("BrewingSession", sessionId));
        
        if (!session.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        readingRepository.save(FermentationReading.builder()
                .brewingSessionId(sessionId)
                .gravity(dto.gravity())
                .temperature(dto.temperature())
                .notes(dto.notes())
                .timestamp(dto.timestamp() != null ? dto.timestamp() : LocalDateTime.now())
                .build());
    }

    private void generateDefaultTasks(BrewingSession session, RecipeDto recipe) {
        List<BrewingTask> tasks = new ArrayList<>();
        int index = 0;

        // Preparation
        tasks.add(createTask(session.getId(), "Sanitize all equipment", BrewingTaskCategory.PREPARATION, index++, null));
        tasks.add(createTask(session.getId(), "Heat strike water", BrewingTaskCategory.PREPARATION, index++, null));

        // Mashing
        if (recipe.mashSteps() != null && !recipe.mashSteps().isEmpty()) {
            for (RecipeDto.RecipeMashStepDto step : recipe.mashSteps()) {
                tasks.add(createTask(session.getId(), 
                    String.format("Mash: %s (%.1f°C)", step.name(), step.temperature()), 
                    BrewingTaskCategory.MASHING, index++, step.duration()));
            }
        } else {
            // Default if no mash steps
            tasks.add(createTask(session.getId(), "Dough in", BrewingTaskCategory.MASHING, index++, null));
            tasks.add(createTask(session.getId(), "Mash stability check", BrewingTaskCategory.MASHING, index++, 60));
        }
        tasks.add(createTask(session.getId(), "Mash out", BrewingTaskCategory.MASHING, index++, 10));

        // Boiling
        tasks.add(createTask(session.getId(), "Start boil", BrewingTaskCategory.BOILING, index++, recipe.boilTime()));
        
        // Dynamic Hop Tasks
        if (recipe.hops() != null) {
            List<RecipeDto.RecipeHopDto> boilHops = recipe.hops().stream()
                    .filter(h -> "BOIL".equals(h.phase()))
                    .sorted(Comparator.comparingInt(RecipeDto.RecipeHopDto::duration).reversed())
                    .toList();
            
            for (RecipeDto.RecipeHopDto hop : boilHops) {
                tasks.add(createTask(session.getId(), 
                    String.format("Add hop: %dg (at T-%d min)", hop.amount().intValue(), hop.duration()), 
                    BrewingTaskCategory.BOILING, index++, null));
            }
        }

        // Post-Boil
        tasks.add(createTask(session.getId(), "Chill wort to pitching temp", BrewingTaskCategory.POST_BOIL, index++, null));
        tasks.add(createTask(session.getId(), "Pitch yeast", BrewingTaskCategory.POST_BOIL, index++, null));

        taskRepository.saveAll(tasks);
    }

    @Transactional
    public void toggleTask(Long taskId) {
        BrewingTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task", taskId));
        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);

        // Auto-transition logic
        autoTransitionIfNecessary(task.getBrewingSessionId(), task.getCategory());
    }

    private void autoTransitionIfNecessary(Long sessionId, BrewingTaskCategory category) {
        List<BrewingTask> tasks = taskRepository.findByBrewingSessionIdOrderByOrderIndexAsc(sessionId);
        
        boolean allCategoryCompleted = tasks.stream()
                .filter(t -> t.getCategory() == category)
                .allMatch(BrewingTask::isCompleted);
        
        if (allCategoryCompleted) {
            BrewingSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new EntityNotFoundException("Session", sessionId));
            
            // Transition logic based on category
            switch (category) {
                case PREPARATION -> {
                    if (session.getStatus() == BrewingStatus.PLANNED) {
                        session.setStatus(BrewingStatus.MASHING);
                    }
                }
                case MASHING -> {
                    if (session.getStatus() == BrewingStatus.MASHING) {
                        session.setStatus(BrewingStatus.BOILING);
                    }
                }
                case BOILING -> {
                    if (session.getStatus() == BrewingStatus.BOILING) {
                        session.setStatus(BrewingStatus.FERMENTING);
                        session.setBrewDate(LocalDate.now()); // Done with brew day
                    }
                }
            }
            sessionRepository.save(session);
        }
    }

    private BrewingTask createTask(Long sessionId, String label, BrewingTaskCategory category, int index, Integer duration) {
        return BrewingTask.builder()
                .brewingSessionId(sessionId)
                .label(label)
                .category(category)
                .completed(false)
                .orderIndex(index)
                .duration(duration)
                .build();
    }

    private User getCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}
