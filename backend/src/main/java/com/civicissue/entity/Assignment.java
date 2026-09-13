package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** Records that an issue has been assigned to a department (and optionally a staff member). */
@Entity
@Table(name = "assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @ManyToOne(optional = false)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to_staff")
    private User assignedToStaff;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    private String notes;

    @PrePersist
    protected void onCreate() { assignedAt = LocalDateTime.now(); }
}
