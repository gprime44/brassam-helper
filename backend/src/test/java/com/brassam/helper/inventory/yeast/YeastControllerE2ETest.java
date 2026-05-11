package com.brassam.helper.inventory.yeast;

import org.junit.jupiter.api.Nested;
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
class YeastControllerE2ETest {

    @Autowired
    private MockMvcTester mvc;

    private String getExpectedJson(TestInfo testInfo) throws Exception {
        String methodName = testInfo.getTestMethod().get().getName();
        return Files.readString(Path.of("src/test/resources/expectations/" + methodName + ".json"));
    }

    @Nested
    class YeastServiceTests {

        @Test
        void shouldReturnAllYeasts(TestInfo testInfo) throws Exception {
            // when
            assertThat(mvc.get().uri("/api/yeasts").exchange())
            // then
            .hasStatusOk()
            .bodyJson()
            .isStrictlyEqualTo(getExpectedJson(testInfo));
        }

        @Test
        void shouldReturnFilteredYeastsBySearchParam(TestInfo testInfo) throws Exception {
            // when
            assertThat(mvc.get().uri("/api/yeasts").param("name", "US-05").exchange())
            // then
            .hasStatusOk()
            .bodyJson()
            .isStrictlyEqualTo(getExpectedJson(testInfo));
        }
    }
}
