package com.brassam.helper.inventory.hops;

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
class HopControllerE2ETest {

    @Autowired
    private MockMvcTester mvc;

    private String getExpectedJson(TestInfo testInfo) throws Exception {
        String methodName = testInfo.getTestMethod().get().getName();
        return Files.readString(Path.of("src/test/resources/expectations/" + methodName + ".json"));
    }

    @Nested
    class HopServiceTests {

        @Test
        void shouldReturnAllHops(TestInfo testInfo) throws Exception {
            assertThat(mvc.get().uri("/api/hops").exchange())
                .hasStatusOk()
                .bodyJson()
                .isStrictlyEqualTo(getExpectedJson(testInfo));
        }

        @Test
        void shouldReturnFilteredHopsBySearchParam(TestInfo testInfo) throws Exception {
            assertThat(mvc.get().uri("/api/hops").param("name", "Cascade").exchange())
                .hasStatusOk()
                .bodyJson()
                .isStrictlyEqualTo(getExpectedJson(testInfo));
        }
    }
}
