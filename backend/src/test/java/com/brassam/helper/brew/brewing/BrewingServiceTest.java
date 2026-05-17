package com.brassam.helper.brew.brewing;

import com.brassam.helper.auth.UserRepository;
import com.brassam.helper.exception.EntityNotFoundException;
import com.brassam.helper.recipe.Recipe;
import com.brassam.helper.recipe.RecipeDto;
import com.brassam.helper.recipe.RecipeRepository;
import com.brassam.helper.recipe.RecipeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BrewingServiceTest {

    @Mock
    private BrewingSessionRepository sessionRepository;
    @Mock
    private BrewingTaskRepository taskRepository;
    @Mock
    private FermentationReadingRepository readingRepository;
    @Mock
    private RecipeService recipeService;
    @Mock
    private RecipeRepository recipeRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BrewingService brewingService;

    private UUID recipeExternalId;
    private Recipe recipe;
    private RecipeDto recipeDto;
    private com.brassam.helper.auth.User user;

    @BeforeEach
    void setUp() {
        recipeExternalId = UUID.randomUUID();
        user = com.brassam.helper.auth.User.builder().id(1L).username("testuser").build();

        recipe = Recipe.builder()
                .id(1L)
                .externalId(recipeExternalId)
                .name("Old Ale")
                .userId(1L)
                .build();
        
        recipeDto = new RecipeDto(recipeExternalId, "Old Ale", "Desc", 20.0, 75.0, 60,
                1.050, 1.012, 5.0, 30.0, 25.0, List.of(), List.of(), List.of(), null);
    }

    private void mockSecurityContext() {
        org.springframework.security.core.Authentication auth = mock(org.springframework.security.core.Authentication.class);
        when(auth.getPrincipal()).thenReturn("testuser");
        org.springframework.security.core.context.SecurityContext securityContext = mock(org.springframework.security.core.context.SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        org.springframework.security.core.context.SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
    }

    @Test
    void shouldStartSessionWithSnapshotsAndTasks() {
        mockSecurityContext();
        when(recipeService.getRecipeByExternalId(recipeExternalId)).thenReturn(recipeDto);
        when(recipeRepository.findByExternalId(recipeExternalId)).thenReturn(Optional.of(recipe));
        when(sessionRepository.save(any(BrewingSession.class))).thenAnswer(i -> {
            BrewingSession s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        BrewingSession session = brewingService.startSession(recipeExternalId);

        assertThat(session.getName()).contains("Old Ale");
        assertThat(session.getTargetOg()).isEqualTo(1.050);
        assertThat(session.getStatus()).isEqualTo(BrewingStatus.PLANNED);
        
        verify(taskRepository).saveAll(anyList());
    }

    @Test
    void shouldGenerateHopTasks() {
        mockSecurityContext();
        RecipeDto.RecipeHopDto hop = new RecipeDto.RecipeHopDto(1L, 1L, 50.0, "BOIL", 60);
        recipeDto = new RecipeDto(recipeExternalId, "Hoppy Ale", "Desc", 20.0, 75.0, 60,
                1.050, 1.012, 5.0, 30.0, 25.0, List.of(), List.of(hop), List.of(), null);

        when(recipeService.getRecipeByExternalId(recipeExternalId)).thenReturn(recipeDto);
        when(recipeRepository.findByExternalId(recipeExternalId)).thenReturn(Optional.of(recipe));
        when(sessionRepository.save(any(BrewingSession.class))).thenAnswer(i -> {
            BrewingSession s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        brewingService.startSession(recipeExternalId);

        verify(taskRepository).saveAll(argThat(list -> {
            List<BrewingTask> tasks = (List<BrewingTask>) list;
            return tasks.stream().anyMatch(t -> t.getLabel().contains("Add hop: 50g") && t.getCategory() == BrewingTaskCategory.BOILING);
        }));
    }

    @Test
    void shouldAutoTransitionToMashingWhenPreparationIsDone() {
        Long sessionId = 100L;
        BrewingSession session = BrewingSession.builder().id(sessionId).userId(1L).status(BrewingStatus.PLANNED).build();
        BrewingTask task = BrewingTask.builder().id(1L).brewingSessionId(sessionId).category(BrewingTaskCategory.PREPARATION).completed(false).build();
        
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.findByBrewingSessionIdOrderByOrderIndexAsc(sessionId)).thenReturn(List.of(task));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        brewingService.toggleTask(1L);

        assertThat(task.isCompleted()).isTrue();
        assertThat(session.getStatus()).isEqualTo(BrewingStatus.MASHING);
        verify(sessionRepository).save(session);
    }
}
