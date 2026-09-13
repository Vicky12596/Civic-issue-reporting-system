package com.civicissue.repository;

import com.civicissue.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByIssueIdAndUserId(Long issueId, Long userId);
    long countByIssueId(Long issueId);
    boolean existsByIssueIdAndUserId(Long issueId, Long userId);
}
