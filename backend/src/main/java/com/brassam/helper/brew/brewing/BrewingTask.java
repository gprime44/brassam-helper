package com.brassam.helper.brew.brewing;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "brewing_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrewingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brewing_session_id", nullable = false)
    private Long brewingSessionId;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BrewingTaskCategory category;

    @Column(nullable = false)
    private int orderIndex;

    private Integer duration;
}
