package com.brassam.helper.inventory.fermentable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FermentableRepository extends JpaRepository<Fermentable, Long> {
    Page<Fermentable> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
