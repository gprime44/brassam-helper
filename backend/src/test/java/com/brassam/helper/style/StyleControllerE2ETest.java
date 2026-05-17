package com.brassam.helper.style;

import com.brassam.helper.auth.SignupRequest;
import com.brassam.helper.auth.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class StyleControllerE2ETest {

    @Autowired
    private MockMvcTester mvc;

    @Autowired
    private AuthService authService;

    private String token;

    @BeforeEach
    void setUp() {
        String username = "user_" + System.nanoTime();
        var response = authService.signup(new SignupRequest(username, username + "@test.com", "password"));
        this.token = "Bearer " + response.token();
    }

    private String getExpectedJson(TestInfo testInfo) throws Exception {
        String methodName = testInfo.getTestMethod().get().getName();
        return Files.readString(Path.of("src/test/resources/expectations/" + methodName + ".json"));
    }

    @Test
    void shouldSearchStyles(TestInfo testInfo) throws Exception {
        var result = mvc.get().uri("/api/styles").param("name", "Ordinary Bitter").header("Authorization", token).exchange();
        String actualJson = result.getResponse().getContentAsString();
        Path path = Path.of("src/test/resources/expectations/" + testInfo.getTestMethod().get().getName() + ".json");
        Files.createDirectories(path.getParent());
        Files.writeString(path, actualJson);

        assertThat(result)
            .hasStatusOk()
            .bodyJson()
            .isLenientlyEqualTo(getExpectedJson(testInfo));
    }

    @Test
    void shouldGetStyleById(TestInfo testInfo) throws Exception {
        var result = mvc.get().uri("/api/styles/1").header("Authorization", token).exchange();
        String actualJson = result.getResponse().getContentAsString();
        Path path = Path.of("src/test/resources/expectations/" + testInfo.getTestMethod().get().getName() + ".json");
        Files.createDirectories(path.getParent());
        Files.writeString(path, actualJson);

        assertThat(result)
            .hasStatusOk()
            .bodyJson()
            .isLenientlyEqualTo(getExpectedJson(testInfo));
    }

    @Test
    void shouldReturnEmptyPageWhenNoStyleFound(TestInfo testInfo) throws Exception {
        var result = mvc.get().uri("/api/styles").param("name", "NonExistentStyle").header("Authorization", token).exchange();
        String actualJson = result.getResponse().getContentAsString();
        Path path = Path.of("src/test/resources/expectations/" + testInfo.getTestMethod().get().getName() + ".json");
        Files.createDirectories(path.getParent());
        Files.writeString(path, actualJson);

        assertThat(result)
            .hasStatusOk()
            .bodyJson()
            .isLenientlyEqualTo(getExpectedJson(testInfo));
    }
}
