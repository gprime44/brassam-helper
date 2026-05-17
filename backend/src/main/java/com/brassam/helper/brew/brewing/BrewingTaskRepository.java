package com.brassam.helper.brew.brewing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrewingTaskRepository extends JpaRepository<BrewingTask, Long> {
    List<BrewingTask> findByBrewingSessionIdOrderByOrderIndexAsc(Long brewingSessionId);
}
