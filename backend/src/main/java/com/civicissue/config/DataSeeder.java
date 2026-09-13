package com.civicissue.config;

import com.civicissue.entity.Role;
import com.civicissue.entity.User;
import com.civicissue.repository.RoleRepository;
import com.civicissue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Ensures baseline roles exist and creates a default admin account on first boot,
 * so the app is usable immediately without manual SQL. Change the default password
 * before deploying to production.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));
        roleRepository.findByName("ROLE_CITIZEN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CITIZEN").build()));
        roleRepository.findByName("ROLE_DEPARTMENT_STAFF")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_DEPARTMENT_STAFF").build()));

        if (!userRepository.existsByEmail("admin@civicissue.local")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@civicissue.local")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Default admin created: admin@civicissue.local / Admin@123 (change this!)");
        }
    }
}
