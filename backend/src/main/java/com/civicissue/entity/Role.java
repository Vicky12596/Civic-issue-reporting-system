package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;

/** Represents a system role: ROLE_CITIZEN, ROLE_ADMIN, ROLE_DEPARTMENT_STAFF. */
@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String name;
}
