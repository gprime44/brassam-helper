package com.brassam.helper.brew.brewing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BrewingTaskRepositoryTest {

    @Autowired
    private BrewingTaskRepository brewingTaskRepository;

    @Autowired
    private BrewingSessionRepository brewingSessionRepository;

    @Test
    void shouldSaveAndFindTasks() {
        BrewingSession session = brewingSessionRepository.save(BrewingSession.builder()
                .name("Task Test")
                .status(BrewingStatus.MASHING)
                .recipeId(1L)
                .userId(1L)
                .build());

        BrewingTask task = BrewingTask.builder()
                .brewingSessionId(session.getId())
                .label("Check mash temperature")
                .category(BrewingTaskCategory.MASHING)
                .completed(false)
                .orderIndex(1)
                .build();

        brewingTaskRepository.save(task);

        List<BrewingTask> tasks = brewingTaskRepository.findByBrewingSessionIdOrderByOrderIndexAsc(session.getId());
        
        assertThat(tasks).hasSize(1);
        assertThat(tasks.get(0).getLabel()).isEqualTo("Check mash temperature");
        assertThat(tasks.get(0).getCategory()).isEqualTo(BrewingTaskCategory.MASHING);
    }

    @Test
    void shouldFindTasksOrderedByIndex() {
        BrewingSession session = brewingSessionRepository.save(BrewingSession.builder()
                .name("Order Test").status(BrewingStatus.MASHING).recipeId(1L).userId(1L).build());

        brewingTaskRepository.save(BrewingTask.builder()
                .brewingSessionId(session.getId()).label("Second").orderIndex(2).category(BrewingTaskCategory.MASHING).build());
        brewingTaskRepository.save(BrewingTask.builder()
                .brewingSessionId(session.getId()).label("First").orderIndex(1).category(BrewingTaskCategory.MASHING).build());

        List<BrewingTask> tasks = brewingTaskRepository.findByBrewingSessionIdOrderByOrderIndexAsc(session.getId());
        
        assertThat(tasks).hasSize(2);
        assertThat(tasks.get(0).getLabel()).isEqualTo("First");
        assertThat(tasks.get(1).getLabel()).isEqualTo("Second");
    }
}
