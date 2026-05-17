package com.brassam.helper.recipe;

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
                .contentType(MediaType.APPLICATION_JSON)
                .content(recipeJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Header Test")))
            .andReturn();

        String uuid = JsonPath.read(result.getResponse().getContentAsString(), "$.externalId");

        // 2. GET /api/recipes (List)
        mvc.perform(get("/api/recipes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
            .andExpect(jsonPath("$[*].externalId", hasItem(uuid)));

        // 3. GET /api/recipes/{uuid} (Get One)
        mvc.perform(get("/api/recipes/" + uuid))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.externalId", is(uuid)))
            .andExpect(jsonPath("$.efficiency", is(70.0)));

        // 4. PUT /api/recipes/{uuid} (Update Header)
        String updateJson = """
            {
                "name": "Updated Name",
                "batchVolume": 30.0,
                "efficiency": 75.0
            }
            """;

        mvc.perform(put("/api/recipes/" + uuid)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Updated Name")))
            .andExpect(jsonPath("$.batchVolume", is(30.0)));
    }

    @Test
    void shouldManageFermentables() throws Exception {
        String uuid = createBaseRecipe("Ferm Test");
        Integer fermentableId = getFirstId("/api/fermentables");

        // 1. POST /api/recipes/{uuid}/fermentables (Add)
        String addJson = String.format("""
            {
                "fermentableId": %d,
                "amount": 4000.0
            }
            """, fermentableId);

        MvcResult result = mvc.perform(post("/api/recipes/" + uuid + "/fermentables")
                .contentType(MediaType.APPLICATION_JSON)
                .content(addJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.fermentables", hasSize(1)))
            .andExpect(jsonPath("$.fermentables[0].amount", is(4000.0)))
            .andReturn();

        Integer ingredientId = JsonPath.read(result.getResponse().getContentAsString(), "$.fermentables[0].id");

        // 2. PUT /api/recipes/{uuid}/fermentables/{id} (Update)
        String updateJson = """
            {
                "amount": 5500.0
            }
            """;

        mvc.perform(put("/api/recipes/" + uuid + "/fermentables/" + ingredientId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.fermentables[0].amount", is(5500.0)));

        // 3. DELETE /api/recipes/{uuid}/fermentables/{id} (Delete)
        mvc.perform(delete("/api/recipes/" + uuid + "/fermentables/" + ingredientId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.fermentables", hasSize(0)));
    }

    @Test
    void shouldManageHops() throws Exception {
        String uuid = createBaseRecipe("Hop Test");
        Integer hopId = getFirstId("/api/hops");

        // 1. POST /api/recipes/{uuid}/hops (Add)
        String addJson = String.format("""
            {
                "hopId": %d,
                "amount": 50.0,
                "phase": "BOIL",
                "duration": 60
            }
            """, hopId);

        MvcResult result = mvc.perform(post("/api/recipes/" + uuid + "/hops")
                .contentType(MediaType.APPLICATION_JSON)
                .content(addJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hops", hasSize(1)))
            .andExpect(jsonPath("$.hops[0].duration", is(60)))
            .andReturn();

        Integer ingredientId = JsonPath.read(result.getResponse().getContentAsString(), "$.hops[0].id");

        // 2. PUT /api/recipes/{uuid}/hops/{id} (Update)
        String updateJson = """
            {
                "amount": 25.0,
                "phase": "BOIL",
                "duration": 15
            }
            """;

        mvc.perform(put("/api/recipes/" + uuid + "/hops/" + ingredientId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hops[0].amount", is(25.0)))
            .andExpect(jsonPath("$.hops[0].duration", is(15)));

        // 3. DELETE /api/recipes/{uuid}/hops/{id} (Delete)
        mvc.perform(delete("/api/recipes/" + uuid + "/hops/" + ingredientId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hops", hasSize(0)));
    }

    @Test
    void shouldManageYeast() throws Exception {
        String uuid = createBaseRecipe("Yeast Test");
        Integer yeastId = getFirstId("/api/yeasts");

        // 1. PUT /api/recipes/{uuid}/yeast (Update/Set)
        String yeastJson = String.format("""
            {
                "yeastId": %d,
                "amount": 11.0
            }
            """, yeastId);

        mvc.perform(put("/api/recipes/" + uuid + "/yeast")
                .contentType(MediaType.APPLICATION_JSON)
                .content(yeastJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.yeast.yeastId", is(yeastId)))
            .andExpect(jsonPath("$.yeast.amount", is(11.0)));

        // 2. Test set another yeast (replace)
        // We get the second yeast ID if available, otherwise reuse the same but let's assume multiple yeasts in the unified DB
        Integer anotherYeastId = getSecondId("/api/yeasts");
        
        String anotherYeastJson = String.format("""
            {
                "yeastId": %d,
                "amount": 22.0
            }
            """, anotherYeastId);
        mvc.perform(put("/api/recipes/" + uuid + "/yeast")
                .contentType(MediaType.APPLICATION_JSON)
                .content(anotherYeastJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.yeast.yeastId", is(anotherYeastId)));
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk())
            .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.externalId");
    }

    private Integer getFirstId(String uri) throws Exception {
        MvcResult result = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.content[0].id");
    }

    private Integer getSecondId(String uri) throws Exception {
        MvcResult result = mvc.perform(get(uri))
                .andExpect(status().isOk())
                .andReturn();
        try {
            return JsonPath.read(result.getResponse().getContentAsString(), "$.content[1].id");
        } catch (Exception e) {
            return JsonPath.read(result.getResponse().getContentAsString(), "$.content[0].id");
        }
    }
}
