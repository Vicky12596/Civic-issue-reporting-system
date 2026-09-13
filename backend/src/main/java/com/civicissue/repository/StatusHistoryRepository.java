package com.civicissue.repository;

import com.civicissue.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByIssueIdOrderByChangedAtAsc(Long issueId);
}
