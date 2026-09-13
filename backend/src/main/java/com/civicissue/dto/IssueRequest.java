package com.civicissue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/** Payload for creating or updating an issue report. */
@Data
public class IssueRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Long categoryId;

    private Boolean isAnonymous = false;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String address;
    private String city;
    private String priority; // LOW | MEDIUM | HIGH | CRITICAL
    private List<String> imageUrls;
}
