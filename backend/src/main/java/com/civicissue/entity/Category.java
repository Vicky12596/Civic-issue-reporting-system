package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;

/** Issue category, e.g. ROAD_DAMAGE, GARBAGE_COLLECTION, WATER_LEAKAGE. */
@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    private String icon;

    @ManyToOne
    @JoinColumn(name = "default_department_id")
    private Department defaultDepartment;
}
