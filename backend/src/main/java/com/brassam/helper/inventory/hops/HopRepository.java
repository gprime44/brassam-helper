package com.brassam.helper.inventory.hops;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HopRepository extends JpaRepository<Hop, Long> {
    Page<Hop> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
