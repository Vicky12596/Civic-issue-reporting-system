package com.civicissue.controller;

import com.civicissue.entity.Notification;
import com.civicissue.repository.NotificationRepository;
import com.civicissue.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** In-app notification inbox endpoints. */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<Notification>> list() {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount() {
        return ResponseEntity.ok(Map.of("count", notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.noContent().build();
    }
}
