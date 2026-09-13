package com.civicissue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/** A civic issue reported by a citizen (road damage, garbage, water leakage, etc). */
@Entity
@Table(name = "issues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Issue {

    public enum Priority { LOW, MEDIUM, HIGH, CRITICAL }
    public enum Status { PENDING, VERIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @Column(name = "is_anonymous")
    @Builder.Default
    private Boolean isAnonymous = false;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;
    private String city;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "upvote_count")
    @Builder.Default
    private Integer upvoteCount = 0;

    @Column(name = "reported_date")
    private LocalDate reportedDate;

    @Column(name = "reported_time")
    private LocalTime reportedTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<IssueImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (reportedDate == null) reportedDate = LocalDate.now();
        if (reportedTime == null) reportedTime = LocalTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
