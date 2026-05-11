package com.brassam.helper.brew.fermentable;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FermentableRepository extends JpaRepository<Fermentable, Long> {
    List<Fermentable> findByNameContainingIgnoreCase(String name);
}
