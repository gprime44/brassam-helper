package com.brassam.helper.brew.brewing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FermentationReadingRepositoryTest {

    @Autowired
    private FermentationReadingRepository fermentationReadingRepository;

    @Autowired
    private BrewingSessionRepository brewingSessionRepository;

    @Test
    void shouldSaveAndFindReadings() {
        BrewingSession session = brewingSessionRepository.save(BrewingSession.builder()
                .name("Batch Test")
                .status(BrewingStatus.FERMENTING)
                .recipeId(1L)
                .userId(1L)
                .build());

        FermentationReading reading = FermentationReading.builder()
                .brewingSessionId(session.getId())
                .gravity(1.040)
                .temperature(20.5)
                .timestamp(LocalDateTime.now())
                .build();

        fermentationReadingRepository.save(reading);

        List<FermentationReading> readings = fermentationReadingRepository.findByBrewingSessionIdOrderByTimestampDesc(session.getId());
        
        assertThat(readings).hasSize(1);
        assertThat(readings.get(0).getGravity()).isEqualTo(1.040);
        assertThat(readings.get(0).getBrewingSessionId()).isEqualTo(session.getId());
    }

    @Test
    void shouldFindReadingsOrderedByTimestampDesc() {
        BrewingSession session = brewingSessionRepository.save(BrewingSession.builder()
                .name("Order Test").status(BrewingStatus.FERMENTING).recipeId(1L).userId(1L).build());

        fermentationReadingRepository.save(FermentationReading.builder()
                .brewingSessionId(session.getId()).gravity(1.050).timestamp(LocalDateTime.now().minusDays(1)).build());
        fermentationReadingRepository.save(FermentationReading.builder()
                .brewingSessionId(session.getId()).gravity(1.040).timestamp(LocalDateTime.now()).build());

        List<FermentationReading> readings = fermentationReadingRepository.findByBrewingSessionIdOrderByTimestampDesc(session.getId());
        
        assertThat(readings).hasSize(2);
        assertThat(readings.get(0).getGravity()).isEqualTo(1.040);
        assertThat(readings.get(1).getGravity()).isEqualTo(1.050);
    }
}
