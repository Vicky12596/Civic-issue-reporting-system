package com.civicissue.repository;

import com.civicissue.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {
    List<Issue> findByReporterId(Long reporterId);
    List<Issue> findTop10ByOrderByUpvoteCountDesc(); // trending issues
}
