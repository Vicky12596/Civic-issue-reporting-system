package com.civicissue.repository;

import com.civicissue.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByIssueIdAndParentCommentIsNullOrderByCreatedAtAsc(Long issueId);
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
}
