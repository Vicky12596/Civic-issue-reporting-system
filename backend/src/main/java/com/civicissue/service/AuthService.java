package com.civicissue.service;

import com.civicissue.dto.JwtResponse;
import com.civicissue.dto.LoginRequest;
import com.civicissue.dto.RegisterRequest;

public interface AuthService {
    JwtResponse register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
