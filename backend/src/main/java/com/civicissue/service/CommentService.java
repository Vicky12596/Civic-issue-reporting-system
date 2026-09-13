package com.civicissue.service;

import com.civicissue.dto.CommentRequest;
import java.util.List;
import java.util.Map;

public interface CommentService {
    Map<String, Object> addComment(Long issueId, CommentRequest request, Long userId);
    List<Map<String, Object>> getComments(Long issueId);
}
