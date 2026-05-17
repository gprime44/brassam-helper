package com.brassam.helper.recipe;

import com.brassam.helper.auth.SignupRequest;
import com.brassam.helper.auth.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MvcResult;
import com.jayway.jsonpath.JsonPath;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RecipeControllerE2ETest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AuthService authService;

    private String token;

    @BeforeEach
    void setUp() {
        // Create a test user and get token
        String username = "user_" + System.nanoTime();
        var response = authService.signup(new SignupRequest(username, username + "@test.com", "password"));
        this.token = "Bearer " + response.token();
    }

    @Test
    void shouldManageRecipeHeader() throws Exception {
        // 1. POST /api/recipes (Create)
        String recipeJson = """
            {
                "name": "Header Test",
                "batchVolume": 20.0,
                "efficiency": 70.0
            }
            """;

        MvcResult result = mvc.perform(post("/api/recipes")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(recipeJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Header Test")))
            .andReturn();

        String uuid = JsonPath.read(result.getResponse().getContentAsString(), "$.externalId");

        // 2. GET /api/recipes (List)
        mvc.perform(get("/api/recipes").header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
            .andExpect(jsonPath("$[*].externalId", hasItem(uuid)));

        // 3. GET /api/recipes/{uuid} (Get One)
        mvc.perform(get("/api/recipes/" + uuid).header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.externalId", is(uuid)))
            .andExpect(jsonPath("$.efficiency", is(70.0)));
    }

    @Test
    void shouldManageFermentables() throws Exception {
        String uuid = createBaseRecipe("Ferm Test");
        Integer fermentableId = getFirstId("/api/fermentables");

        String addJson = String.format("""
            {
                "fermentableId": %d,
                "amount": 4000.0
            }
            """, fermentableId);

        MvcResult result = mvc.perform(post("/api/recipes/" + uuid + "/fermentables")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(addJson))
            .andExpect(status().isOk())
            .andReturn();

        Integer ingredientId = JsonPath.read(result.getResponse().getContentAsString(), "$.fermentables[0].id");

        mvc.perform(put("/api/recipes/" + uuid + "/fermentables/" + ingredientId)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 5500.0}"))
            .andExpect(status().isOk());

        mvc.perform(delete("/api/recipes/" + uuid + "/fermentables/" + ingredientId).header("Authorization", token))
            .andExpect(status().isOk());
    }

    @Test
    void shouldManageHops() throws Exception {
        String uuid = createBaseRecipe("Hop Test");
        Integer hopId = getFirstId("/api/hops");

        String addJson = String.format("""
            {
                "hopId": %d,
                "amount": 50.0,
                "phase": "BOIL",
                "duration": 60
            }
            """, hopId);

        MvcResult result = mvc.perform(post("/api/recipes/" + uuid + "/hops")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(addJson))
            .andExpect(status().isOk())
            .andReturn();

        Integer ingredientId = JsonPath.read(result.getResponse().getContentAsString(), "$.hops[0].id");

        mvc.perform(delete("/api/recipes/" + uuid + "/hops/" + ingredientId).header("Authorization", token))
            .andExpect(status().isOk());
    }

    @Test
    void shouldManageYeast() throws Exception {
        String uuid = createBaseRecipe("Yeast Test");
        Integer yeastId = getFirstId("/api/yeasts");

        String yeastJson = String.format("""
            {
                "yeastId": %d,
                "amount": 11.0
            }
            """, yeastId);

        mvc.perform(put("/api/recipes/" + uuid + "/yeast")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(yeastJson))
            .andExpect(status().isOk());
    }

    private String createBaseRecipe(String name) throws Exception {
        String json = String.format("""
            {
                "name": "%s",
                "batchVolume": 20.0,
                "efficiency": 75.0
            }
            """, name);
        MvcResult result = mvc.perform(post("/api/recipes")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk())
            .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.externalId");
    }

    private Integer getFirstId(String uri) throws Exception {
        MvcResult result = mvc.perform(get(uri).header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.content[0].id");
    }
}
