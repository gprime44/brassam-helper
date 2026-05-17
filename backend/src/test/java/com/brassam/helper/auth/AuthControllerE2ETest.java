package com.brassam.helper.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerE2ETest {

    @Autowired
    private MockMvc mvc;

    @Test
    void shouldSignupAndLogin() throws Exception {
        // 1. Signup
        String signupJson = """
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123"
            }
            """;

        mvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signupJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", notNullValue()))
            .andExpect(jsonPath("$.username", is("testuser")));

        // 2. Login
        String loginJson = """
            {
                "username": "testuser",
                "password": "password123"
            }
            """;

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", notNullValue()))
            .andExpect(jsonPath("$.username", is("testuser")));
    }

    @Test
    void shouldFailLoginWithWrongPassword() throws Exception {
        // Create user first
        String signupJson = """
            {
                "username": "failuser",
                "email": "fail@example.com",
                "password": "password123"
            }
            """;
        mvc.perform(post("/api/auth/signup").contentType(MediaType.APPLICATION_JSON).content(signupJson));

        // Attempt login with wrong password
        String loginJson = """
            {
                "username": "failuser",
                "password": "wrongpassword"
            }
            """;

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
            .andExpect(status().isUnauthorized()); 
    }
}
