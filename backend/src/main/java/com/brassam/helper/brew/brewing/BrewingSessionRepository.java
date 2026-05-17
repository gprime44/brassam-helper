package com.brassam.helper.brew.brewing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrewingSessionRepository extends JpaRepository<BrewingSession, Long> {
    List<BrewingSession> findByUserId(Long userId);
    List<BrewingSession> findByUserIdAndStatus(Long userId, BrewingStatus status);
}
