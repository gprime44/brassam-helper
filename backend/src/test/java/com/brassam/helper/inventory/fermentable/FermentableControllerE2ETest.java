package com.brassam.helper.inventory.fermentable;

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
class FermentableControllerE2ETest {

    @Autowired
    private MockMvcTester mvc;

    private String getExpectedJson(TestInfo testInfo) throws Exception {
        String methodName = testInfo.getTestMethod().get().getName();
        return Files.readString(Path.of("src/test/resources/expectations/" + methodName + ".json"));
    }

    @Nested
    class FermentableServiceTests {

        @Test
        void shouldReturnAllFermentablesWhenNoSearchParam(TestInfo testInfo) throws Exception {
            // when
            assertThat(mvc.get().uri("/api/fermentables").exchange())
            // then
            .hasStatusOk()
            .bodyJson()
            .isStrictlyEqualTo(getExpectedJson(testInfo));
        }

        @Test
        void shouldReturnFilteredFermentablesWhenSearchParamProvided(TestInfo testInfo) throws Exception {
            // when
            assertThat(mvc.get().uri("/api/fermentables").param("name", "maris").exchange())
            // then
            .hasStatusOk()
            .bodyJson()
            .isStrictlyEqualTo(getExpectedJson(testInfo));
        }
    }
}
