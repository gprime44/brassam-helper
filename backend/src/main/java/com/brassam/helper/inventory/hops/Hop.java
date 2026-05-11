package com.brassam.helper.inventory.hops;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hops")
@Data
public class Hop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double alphaAcid;
    private String origin;
}
