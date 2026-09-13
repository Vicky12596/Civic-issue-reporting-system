package com.civicissue.controller;

import com.civicissue.dto.CommentRequest;
import com.civicissue.security.CurrentUser;
import com.civicissue.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Comment + threaded reply endpoints for a given issue. */
@RestController
@RequestMapping("/api/issues/{issueId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<Map<String, Object>> add(@PathVariable Long issueId,
                                                     @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(issueId, request, currentUser.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@PathVariable Long issueId) {
        return ResponseEntity.ok(commentService.getComments(issueId));
    }
}
