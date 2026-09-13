package com.civicissue.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/** Read-only projection of an issue returned to clients (hides reporter identity if anonymous). */
@Data @Builder
public class IssueResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String reporterName;   // "Anonymous" if isAnonymous == true
    private Double latitude;
    private Double longitude;
    private String address;
    private String city;
    private String priority;
    private String status;
    private Integer upvoteCount;
    private Boolean upvotedByCurrentUser;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
}
