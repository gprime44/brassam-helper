package com.brassam.helper.brew.hops;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HopRepository extends JpaRepository<Hop, Long> {
    List<Hop> findByNameContainingIgnoreCase(String name);
}
