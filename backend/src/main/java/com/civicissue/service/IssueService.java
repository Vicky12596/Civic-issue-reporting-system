package com.civicissue.service;

import com.civicissue.dto.IssueRequest;
import com.civicissue.dto.IssueResponse;
import com.civicissue.dto.StatusUpdateRequest;

import java.util.List;

public interface IssueService {
    IssueResponse createIssue(IssueRequest request, Long reporterId);
    IssueResponse getIssueById(Long issueId, Long currentUserId);
    List<IssueResponse> getAllIssues(String category, String status, String city, String priority, String search);
    List<IssueResponse> getMyIssues(Long userId);
    List<IssueResponse> getTrendingIssues();
    IssueResponse updateStatus(Long issueId, StatusUpdateRequest request, Long adminId);
    void deleteIssue(Long issueId);
    boolean toggleUpvote(Long issueId, Long userId);
}
