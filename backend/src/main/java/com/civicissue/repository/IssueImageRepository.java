package com.civicissue.repository;

import com.civicissue.entity.IssueImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueImageRepository extends JpaRepository<IssueImage, Long> {
}
