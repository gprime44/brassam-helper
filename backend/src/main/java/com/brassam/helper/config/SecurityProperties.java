package com.brassam.helper.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {
    private List<String> allowedOrigins = new ArrayList<>();
    private Jwt jwt = new Jwt();

    @Data
    public static class Jwt {
        private String secret;
        private long expiration;
    }
}
