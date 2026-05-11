# Backend Standards

- **Methodology:** **TDD (Test Driven Development)** is MANDATORY.
  - Tests (E2E and Unit) must be created alongside the implementation.
  - A feature is only considered complete when its corresponding tests pass and cover the requested functional scope.
- **Architecture:** Strict **Package by Feature**.
  - All code related to a feature (Controller, Service, Repository, Model, DTO, Mapper) MUST be co-located in the same package (e.g., `com.brassam.helper.brew.fermentable`).
  - Technical sub-packages (e.g., `.controller`, `.service`) are FORBIDDEN.
  - **Inter-feature communication:** Features must only communicate via their **Services**. Direct access to another feature's Repository or Model is FORBIDDEN.
- **Testing Framework:** JUnit 5, MockMvcTester (Spring Boot 4 Standard), AssertJ.
- **Pattern:** BDD (Given-When-Then).
- **Structure:** 
  - End-to-End (E2E) tests for full stack validation.
  - **Class structure:** One class per controller (`ControllerE2ETest`), and one nested class per service tested (`ServiceTests`).
  - **Location:** Test classes must follow the same feature-based package structure as the main code.

- **Tools:**
  - `@SpringBootTest` with H2 for database integration.
  - `@AutoConfigureMockMvc` to enable `MockMvcTester` injection.
  - MapStruct for DTO mapping.
  - Lombok for boilerplate code.

- **Expectations:** 
  - One expectation file per test method, stored in `src/test/resources/expectations/`.
  - File name must match the test method name (`methodName.json`).
  - Strict JSON comparison is mandatory: `.bodyJson().isStrictlyEqualTo(...)`.

- **Example Test (Spring Boot 4 style):**
  ```java
  package com.brassam.helper.brew.fermentable;

  @SpringBootTest
  @AutoConfigureMockMvc
  @Transactional
  class FermentableControllerE2ETest {
      @Autowired private MockMvcTester mvc;

      private String getExpectedJson(TestInfo testInfo) throws Exception {
          String methodName = testInfo.getTestMethod().get().getName();
          return Files.readString(Path.of("src/test/resources/expectations/" + methodName + ".json"));
      }

      @Nested
      class FermentableServiceTests {
          @Test
          void shouldReturnFermentablesFromDb(TestInfo testInfo) throws Exception {
              // when
              assertThat(mvc.get().uri("/api/fermentables").exchange())
              // then
              .hasStatusOk()
              .bodyJson()
              .isStrictlyEqualTo(getExpectedJson(testInfo));
          }
      }
  }
  ```
