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
class BrewingSessionRepositoryTest {

    @Autowired
    private BrewingSessionRepository brewingSessionRepository;

    @Test
    void shouldSaveAndFindBrewingSession() {
        BrewingSession session = BrewingSession.builder()
                .name("Test Batch")
                .status(BrewingStatus.PLANNED)
                .recipeId(1L)
                .userId(1L)
                .targetOg(1.050)
                .targetBatchSize(20.0)
                .build();

        BrewingSession savedSession = brewingSessionRepository.save(session);

        assertThat(savedSession.getId()).isNotNull();
        
        List<BrewingSession> found = brewingSessionRepository.findByUserId(1L);
        assertThat(found).isNotEmpty();
        assertThat(found.get(0).getName()).isEqualTo("Test Batch");
    }

    @Test
    void shouldFindByStatus() {
        brewingSessionRepository.save(BrewingSession.builder()
                .name("Batch 1").status(BrewingStatus.PLANNED).userId(1L).recipeId(1L).build());
        brewingSessionRepository.save(BrewingSession.builder()
                .name("Batch 2").status(BrewingStatus.MASHING).userId(1L).recipeId(2L).build());

        List<BrewingSession> brewing = brewingSessionRepository.findByUserIdAndStatus(1L, BrewingStatus.MASHING);
        
        assertThat(brewing).hasSize(1);
        assertThat(brewing.get(0).getName()).isEqualTo("Batch 2");
    }
}
