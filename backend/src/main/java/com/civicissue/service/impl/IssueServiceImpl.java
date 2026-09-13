package com.civicissue.service.impl;

import com.civicissue.dto.IssueRequest;
import com.civicissue.dto.IssueResponse;
import com.civicissue.dto.StatusUpdateRequest;
import com.civicissue.entity.*;
import com.civicissue.exception.ResourceNotFoundException;
import com.civicissue.repository.*;
import com.civicissue.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Core business logic for creating, listing, filtering, and progressing civic issues
 * through their status lifecycle (PENDING -> VERIFIED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED).
 */
@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final IssueImageRepository issueImageRepository;
    private final VoteRepository voteRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public IssueResponse createIssue(IssueRequest request, Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .reporter(reporter)
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .city(request.getCity())
                .priority(request.getPriority() != null
                        ? Issue.Priority.valueOf(request.getPriority()) : Issue.Priority.MEDIUM)
                .status(Issue.Status.PENDING)
                .build();

        issue = issueRepository.save(issue);

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                issueImageRepository.save(IssueImage.builder().issue(issue).imageUrl(url).build());
            }
        }

        statusHistoryRepository.save(StatusHistory.builder()
                .issue(issue).oldStatus(null).newStatus("PENDING")
                .changedBy(reporter).remarks("Issue reported").build());

        return toResponse(issue, reporterId);
    }

    @Override
    public IssueResponse getIssueById(Long issueId, Long currentUserId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        return toResponse(issue, currentUserId);
    }

    @Override
    public List<IssueResponse> getAllIssues(String category, String status, String city, String priority, String search) {
        // NOTE: for brevity this filters in-memory; replace with JPA Specification
        // (see repository.JpaSpecificationExecutor already wired on IssueRepository) for production scale.
        return issueRepository.findAll().stream()
                .filter(i -> category == null || i.getCategory().getName().equalsIgnoreCase(category))
                .filter(i -> status == null || i.getStatus().name().equalsIgnoreCase(status))
                .filter(i -> city == null || (i.getCity() != null && i.getCity().equalsIgnoreCase(city)))
                .filter(i -> priority == null || i.getPriority().name().equalsIgnoreCase(priority))
                .filter(i -> search == null || i.getTitle().toLowerCase().contains(search.toLowerCase()))
                .map(i -> toResponse(i, null))
                .toList();
    }

    @Override
    public List<IssueResponse> getMyIssues(Long userId) {
        return issueRepository.findByReporterId(userId).stream().map(i -> toResponse(i, userId)).toList();
    }

    @Override
    public List<IssueResponse> getTrendingIssues() {
        return issueRepository.findTop10ByOrderByUpvoteCountDesc().stream().map(i -> toResponse(i, null)).toList();
    }

    @Override
    @Transactional
    public IssueResponse updateStatus(Long issueId, StatusUpdateRequest request, Long adminId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        String oldStatus = issue.getStatus().name();
        issue.setStatus(Issue.Status.valueOf(request.getStatus()));
        issueRepository.save(issue);

        statusHistoryRepository.save(StatusHistory.builder()
                .issue(issue).oldStatus(oldStatus).newStatus(request.getStatus())
                .changedBy(admin).remarks(request.getRemarks()).build());

        notificationRepository.save(Notification.builder()
                .user(issue.getReporter())
                .issue(issue)
                .type(Notification.Type.STATUS_UPDATE)
                .title("Issue status updated")
                .message("Your report \"" + issue.getTitle() + "\" is now " + request.getStatus())
                .build());

        return toResponse(issue, null);
    }

    @Override
    @Transactional
    public void deleteIssue(Long issueId) {
        if (!issueRepository.existsById(issueId)) {
            throw new ResourceNotFoundException("Issue not found");
        }
        issueRepository.deleteById(issueId);
    }

    @Override
    @Transactional
    public boolean toggleUpvote(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var existingVote = voteRepository.findByIssueIdAndUserId(issueId, userId);
        if (existingVote.isPresent()) {
            voteRepository.delete(existingVote.get());
            issue.setUpvoteCount(Math.max(0, issue.getUpvoteCount() - 1));
            issueRepository.save(issue);
            return false; // now un-voted
        } else {
            voteRepository.save(Vote.builder().issue(issue).user(user).build());
            issue.setUpvoteCount(issue.getUpvoteCount() + 1);
            issueRepository.save(issue);
            return true; // now voted
        }
    }

    private IssueResponse toResponse(Issue issue, Long currentUserId) {
        boolean upvoted = currentUserId != null &&
                voteRepository.existsByIssueIdAndUserId(issue.getId(), currentUserId);

        return IssueResponse.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .category(issue.getCategory().getName())
                .reporterName(Boolean.TRUE.equals(issue.getIsAnonymous()) ? "Anonymous" : issue.getReporter().getFullName())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .address(issue.getAddress())
                .city(issue.getCity())
                .priority(issue.getPriority().name())
                .status(issue.getStatus().name())
                .upvoteCount(issue.getUpvoteCount())
                .upvotedByCurrentUser(upvoted)
                .imageUrls(issue.getImages().stream().map(IssueImage::getImageUrl).toList())
                .createdAt(issue.getCreatedAt())
                .build();
    }
}
