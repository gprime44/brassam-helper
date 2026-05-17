package com.brassam.helper.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
class WebConfigTest {

    @Autowired
    private SecurityProperties securityProperties;

    @Test
    void shouldLoadAllowedOriginsFromDevProfile() {
        assertThat(securityProperties.getAllowedOrigins())
                .as("Allowed origins should not be empty when 'dev' profile is active")
                .isNotEmpty()
                .contains("http://localhost:5173");
    }
}
