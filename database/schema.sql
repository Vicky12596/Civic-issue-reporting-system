-- =====================================================================
-- Crowdsourced Civic Issue Reporting System - MySQL Schema
-- =====================================================================
CREATE DATABASE IF NOT EXISTS civic_issue_system
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE civic_issue_system;

-- ---------------------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(30) NOT NULL UNIQUE   -- ROLE_CITIZEN, ROLE_ADMIN, ROLE_DEPARTMENT_STAFF
);

-- ---------------------------------------------------------------------
-- DEPARTMENTS  (e.g. Roads, Sanitation, Water Board, Electricity)
-- ---------------------------------------------------------------------
CREATE TABLE departments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    contact_email VARCHAR(150),
    contact_phone VARCHAR(20),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(150) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    phone               VARCHAR(20),
    profile_photo_url   VARCHAR(255),
    is_enabled          BOOLEAN DEFAULT TRUE,
    reset_token         VARCHAR(255),
    reset_token_expiry  TIMESTAMP NULL,
    preferred_language  VARCHAR(10) DEFAULT 'en',   -- 'en' | 'ta'
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(60) NOT NULL UNIQUE,   -- ROAD_DAMAGE, GARBAGE, WATER_LEAKAGE, ...
    icon        VARCHAR(60),
    default_department_id BIGINT,
    FOREIGN KEY (default_department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- ISSUES
-- ---------------------------------------------------------------------
CREATE TABLE issues (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    description     TEXT NOT NULL,
    category_id     BIGINT NOT NULL,
    reporter_id     BIGINT NOT NULL,
    is_anonymous    BOOLEAN DEFAULT FALSE,
    latitude        DECIMAL(10,7) NOT NULL,
    longitude       DECIMAL(10,7) NOT NULL,
    address         VARCHAR(255),
    city            VARCHAR(100),
    priority        ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
    status          ENUM('PENDING','VERIFIED','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED','REJECTED') DEFAULT 'PENDING',
    upvote_count    INT DEFAULT 0,
    reported_date   DATE NOT NULL,
    reported_time   TIME NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_issue_status (status),
    INDEX idx_issue_category (category_id),
    INDEX idx_issue_location (latitude, longitude)
);

-- ---------------------------------------------------------------------
-- ISSUE IMAGES  (multiple images per issue)
-- ---------------------------------------------------------------------
CREATE TABLE issue_images (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id    BIGINT NOT NULL,
    image_url   VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- ASSIGNMENTS  (issue assigned to a department / staff)
-- ---------------------------------------------------------------------
CREATE TABLE assignments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id        BIGINT NOT NULL,
    department_id   BIGINT NOT NULL,
    assigned_by     BIGINT NOT NULL,        -- admin user id
    assigned_to_staff BIGINT,               -- optional staff user id
    assigned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes           VARCHAR(255),
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to_staff) REFERENCES users(id)
);

-- ---------------------------------------------------------------------
-- STATUS HISTORY  (progress timeline)
-- ---------------------------------------------------------------------
CREATE TABLE status_history (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id    BIGINT NOT NULL,
    old_status  VARCHAR(20),
    new_status  VARCHAR(20) NOT NULL,
    changed_by  BIGINT NOT NULL,
    remarks     VARCHAR(255),
    changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ---------------------------------------------------------------------
-- VOTES  (one vote per user per issue - prevents duplicate voting)
-- ---------------------------------------------------------------------
CREATE TABLE votes (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id    BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_vote_issue_user (issue_id, user_id),
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- COMMENTS  (supports replies via parent_comment_id)
-- ---------------------------------------------------------------------
CREATE TABLE comments (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id            BIGINT NOT NULL,
    user_id             BIGINT NOT NULL,
    parent_comment_id   BIGINT NULL,
    content             TEXT NOT NULL,
    image_url           VARCHAR(255),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    issue_id    BIGINT,
    type        ENUM('STATUS_UPDATE','COMMENT','VOTE','SYSTEM') DEFAULT 'SYSTEM',
    title       VARCHAR(150) NOT NULL,
    message     VARCHAR(255) NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------------------
INSERT INTO roles (name) VALUES ('ROLE_CITIZEN'), ('ROLE_ADMIN'), ('ROLE_DEPARTMENT_STAFF');

INSERT INTO departments (name, description) VALUES
 ('Roads & Infrastructure', 'Handles road damage and traffic signals'),
 ('Sanitation', 'Handles garbage collection and illegal dumping'),
 ('Water Board', 'Handles water leakage and drainage'),
 ('Electricity Board', 'Handles street light failures'),
 ('Public Amenities', 'Handles public toilets and other amenities');

INSERT INTO categories (name, icon, default_department_id) VALUES
 ('ROAD_DAMAGE', 'road', 1),
 ('GARBAGE_COLLECTION', 'trash', 2),
 ('WATER_LEAKAGE', 'droplet', 3),
 ('STREET_LIGHT_FAILURE', 'bulb', 4),
 ('DRAINAGE_PROBLEM', 'water', 3),
 ('TRAFFIC_SIGNAL_ISSUE', 'traffic-light', 1),
 ('PUBLIC_TOILET_ISSUE', 'toilet', 5),
 ('ILLEGAL_DUMPING', 'ban', 2),
 ('OTHER', 'flag', NULL);
