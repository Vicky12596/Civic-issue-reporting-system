package com.civicissue.controller;

import com.civicissue.dto.IssueRequest;
import com.civicissue.dto.IssueResponse;
import com.civicissue.dto.StatusUpdateRequest;
import com.civicissue.security.CurrentUser;
import com.civicissue.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** CRUD + tracking endpoints for civic issue reports. */
@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<IssueResponse> create(@Valid @RequestBody IssueRequest request) {
        return ResponseEntity.ok(issueService.createIssue(request, currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id, currentUser.getIdOrNull()));
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(issueService.getAllIssues(category, status, city, priority, search));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<IssueResponse>> myReports() {
        return ResponseEntity.ok(issueService.getMyIssues(currentUser.getId()));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<IssueResponse>> trending() {
        return ResponseEntity.ok(issueService.getTrendingIssues());
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<Map<String, Boolean>> toggleVote(@PathVariable Long id) {
        boolean nowUpvoted = issueService.toggleUpvote(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("upvoted", nowUpvoted));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IssueResponse> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(issueService.updateStatus(id, request, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }
}
