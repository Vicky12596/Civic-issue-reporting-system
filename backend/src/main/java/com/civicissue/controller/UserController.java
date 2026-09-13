package com.civicissue.controller;

import com.civicissue.entity.User;
import com.civicissue.exception.ResourceNotFoundException;
import com.civicissue.repository.UserRepository;
import com.civicissue.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Profile management: view/edit profile, upload photo, change password. */
@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CurrentUser currentUser;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<User> me() {
        return ResponseEntity.ok(userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody Map<String, String> body) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("preferredLanguage")) user.setPreferredLanguage(body.get("preferredLanguage"));
        if (body.containsKey("profilePhotoUrl")) user.setProfilePhotoUrl(body.get("profilePhotoUrl"));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
