package com.civicissue.controller;

import com.civicissue.dto.DashboardStatsResponse;
import com.civicissue.entity.Issue;
import com.civicissue.entity.User;
import com.civicissue.repository.IssueRepository;
import com.civicissue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin-only endpoints: dashboard stats, user management. Issue moderation lives in IssueController. */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsResponse> dashboardStats() {
        long total = issueRepository.count();
        long pending = issueRepository.findAll().stream()
                .filter(i -> i.getStatus() == Issue.Status.PENDING).count();
        long resolved = issueRepository.findAll().stream()
                .filter(i -> i.getStatus() == Issue.Status.RESOLVED || i.getStatus() == Issue.Status.CLOSED).count();

        return ResponseEntity.ok(DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalReports(total)
                .pendingReports(pending)
                .resolvedReports(resolved)
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
