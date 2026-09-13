package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** A single uploaded photo attached to an issue report. */
@Entity
@Table(name = "issue_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() { uploadedAt = LocalDateTime.now(); }
}
