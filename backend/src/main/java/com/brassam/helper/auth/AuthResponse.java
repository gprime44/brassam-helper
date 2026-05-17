package com.brassam.helper.auth;

public record AuthResponse(
    String token,
    String username,
    String email
) {}
