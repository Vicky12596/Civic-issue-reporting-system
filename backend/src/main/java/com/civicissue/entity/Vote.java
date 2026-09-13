package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** An upvote cast by a user on an issue. Unique (issue,user) pair prevents duplicate voting. */
@Entity
@Table(name = "votes", uniqueConstraints = @UniqueConstraint(columnNames = {"issue_id", "user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
