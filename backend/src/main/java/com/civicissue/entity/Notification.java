package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** An in-app notification delivered to a user (status change, comment, vote, system message). */
@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    public enum Type { STATUS_UPDATE, COMMENT, VOTE, SYSTEM }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Type type = Type.SYSTEM;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
