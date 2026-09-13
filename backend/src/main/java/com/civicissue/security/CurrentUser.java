package com.civicissue.security;

import com.civicissue.entity.User;
import com.civicissue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/** Small helper that resolves the authenticated User entity from the Spring Security context. */
@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepository;

    public Long getId() {
        Long id = getIdOrNull();
        if (id == null) throw new IllegalStateException("No authenticated user in context");
        return id;
    }

    public Long getIdOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails userDetails)) {
            return null;
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElse(null);
    }
}
