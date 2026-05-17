package com.brassam.helper.brew.brewing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FermentationReadingRepository extends JpaRepository<FermentationReading, Long> {
    List<FermentationReading> findByBrewingSessionIdOrderByTimestampDesc(Long brewingSessionId);
}
