package com.civicissue.service.impl;

import com.civicissue.dto.CommentRequest;
import com.civicissue.entity.Comment;
import com.civicissue.entity.Issue;
import com.civicissue.entity.User;
import com.civicissue.exception.ResourceNotFoundException;
import com.civicissue.repository.CommentRepository;
import com.civicissue.repository.IssueRepository;
import com.civicissue.repository.UserRepository;
import com.civicissue.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Handles top-level comments and threaded replies on an issue. */
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Map<String, Object> addComment(Long issueId, CommentRequest request, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .issue(issue).user(user).parentComment(parent)
                .content(request.getContent()).imageUrl(request.getImageUrl())
                .build();
        comment = commentRepository.save(comment);
        return toMap(comment);
    }

    @Override
    public List<Map<String, Object>> getComments(Long issueId) {
        return commentRepository.findByIssueIdAndParentCommentIsNullOrderByCreatedAtAsc(issueId)
                .stream().map(this::toMap).toList();
    }

    private Map<String, Object> toMap(Comment c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("author", c.getUser().getFullName());
        m.put("content", c.getContent());
        m.put("imageUrl", c.getImageUrl());
        m.put("createdAt", c.getCreatedAt());
        m.put("replies", commentRepository.findByParentCommentIdOrderByCreatedAtAsc(c.getId())
                .stream().map(this::toMap).toList());
        return m;
    }
}
