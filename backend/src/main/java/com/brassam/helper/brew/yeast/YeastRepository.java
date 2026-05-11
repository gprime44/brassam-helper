package com.brassam.helper.brew.yeast;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface YeastRepository extends JpaRepository<Yeast, Long> {
    List<Yeast> findByNameContainingIgnoreCase(String name);
}
