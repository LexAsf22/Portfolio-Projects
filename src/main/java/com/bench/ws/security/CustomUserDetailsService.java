package com.bench.ws.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bench.ws.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        com.bench.ws.dto.User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username));

        // FIX: Use the actual role from the database (MEMBER, ADMIN, MODERATOR)
        // instead of hardcoded "USER" — this makes @PreAuthorize checks work correctly
        String role = (user.getRole() != null && !user.getRole().isBlank())
                ? user.getRole()
                : "MEMBER";

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(role)   // Spring prefixes "ROLE_" automatically → ROLE_MEMBER, ROLE_ADMIN
                .build();
    }
}