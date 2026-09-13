package com.civicissue.service.impl;

import com.civicissue.dto.JwtResponse;
import com.civicissue.dto.LoginRequest;
import com.civicissue.dto.RegisterRequest;
import com.civicissue.entity.Role;
import com.civicissue.entity.User;
import com.civicissue.exception.BadRequestException;
import com.civicissue.exception.ResourceNotFoundException;
import com.civicissue.repository.RoleRepository;
import com.civicissue.repository.UserRepository;
import com.civicissue.security.JwtUtil;
import com.civicissue.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Handles registration, login, and password-reset flows.
 * Passwords are always stored BCrypt-hashed, never in plain text.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        Role citizenRole = roleRepository.findByName("ROLE_CITIZEN")
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found. Seed roles table first."));

        Set<Role> roles = new HashSet<>();
        roles.add(citizenRole);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .roles(roles)
                .build();

        userRepository.save(user);
        return buildJwtResponse(user);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildJwtResponse(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found for this email"));
        user.setResetToken(UUID.randomUUID().toString());
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        // TODO: send email via EmailService with the reset link containing the token
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired. Please request a new one.");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private JwtResponse buildJwtResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        List<String> roleNames = user.getRoles().stream().map(Role::getName).toList();
        return JwtResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roles(roleNames)
                .build();
    }
}
