package com.civicissue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Crowdsourced Civic Issue Reporting System backend.
 * Boots the embedded server, initializes Spring context, JPA repositories,
 * and security configuration.
 */
@SpringBootApplication
public class CivicIssueSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(CivicIssueSystemApplication.class, args);
    }
}
