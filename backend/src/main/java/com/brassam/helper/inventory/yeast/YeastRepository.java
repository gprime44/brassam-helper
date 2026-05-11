package com.brassam.helper.inventory.yeast;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YeastRepository extends JpaRepository<Yeast, Long> {
    Page<Yeast> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
