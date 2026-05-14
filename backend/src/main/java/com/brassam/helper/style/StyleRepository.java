package com.brassam.helper.style;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StyleRepository extends JpaRepository<Style, Long> {
    Page<Style> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
