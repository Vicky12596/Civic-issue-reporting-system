package com.civicissue.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalReports;
    private long pendingReports;
    private long resolvedReports;
}
