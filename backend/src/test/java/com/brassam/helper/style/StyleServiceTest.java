package com.brassam.helper.style;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class StyleServiceTest {

    @Autowired
    private StyleService styleService;

    @Test
    void shouldSearchStylesByName() {
        Page<StyleDto> result = styleService.search("Bitter", PageRequest.of(0, 20));
        
        assertThat(result.getContent()).isNotEmpty();
        assertThat(result.getContent().get(0).name()).contains("Bitter");
    }

    @Test
    void shouldFindStyleById() {
        // ID 1 should be Ordinary Bitter from Liquibase test context
        StyleDetailDto result = styleService.findById(1L);
        
        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Ordinary Bitter");
        assertThat(result.category()).isEqualTo("British Origin Ale Styles");
    }
}
