package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** One entry in an issue's status timeline, used to render progress-tracking UI. */
@Entity
@Table(name = "status_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @Column(name = "old_status")
    private String oldStatus;

    @Column(name = "new_status", nullable = false)
    private String newStatus;

    @ManyToOne(optional = false)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    private String remarks;

    @Column(name = "changed_at")
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() { changedAt = LocalDateTime.now(); }
}
