package com.brassam.helper.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final SecurityProperties securityProperties;

    @PostConstruct
    public void init() {
        log.info("CORS allowed origins: {}", securityProperties.getAllowedOrigins());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (securityProperties.getAllowedOrigins() != null && !securityProperties.getAllowedOrigins().isEmpty()) {
            registry.addMapping("/**")
                    .allowedOrigins(securityProperties.getAllowedOrigins().toArray(new String[0]))
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        } else {
            log.warn("CORS allowed origins list is empty! No CORS mapping added.");
        }
    }
}
