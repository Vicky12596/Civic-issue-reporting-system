package com.civicissue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotBlank
    private String status; // PENDING | VERIFIED | ASSIGNED | IN_PROGRESS | RESOLVED | CLOSED | REJECTED
    private String remarks;
}
