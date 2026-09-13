package com.civicissue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder @AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private List<String> roles;
}
