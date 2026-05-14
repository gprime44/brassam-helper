# Domain: Style

This domain provides a catalog of beer styles (based on BJCP guidelines) to serve as a reference for brewers. It allows comparing recipe metrics with style targets and provides serving recommendations.

## 🏗️ Architecture: DTO Split
To maintain high performance and low data usage on mobile devices:
1. **StyleDto (Lightweight):** Contains only name, category, and technical ranges. Used for search results and dropdowns.
2. **StyleDetailDto (Complete):** Includes detailed sensory descriptions, historical notes, and serving suggestions.

---

## 1. Style Structure

### Search/Reference Fields (StyleDto)
- `id`: Long. Internal identifier.
- `name`: String. Name of the style (e.g., "American IPA").
- `category`: String. Broad category (e.g., "North American Origin Ale Styles").
- `styleId`: String. Original BJCP/BeerProto ID (e.g., "21A") for sorting and sub-category identification.
- **Technical Ranges (Targets):**
  - `ogMin / ogMax`: Double (Original Gravity).
  - `fgMin / fgMax`: Double (Final Gravity).
  - `ibuMin / ibuMax`: Double (Bitterness).
  - `ebcMin / ebcMax`: Double (Color).
  - `abvMin / abvMax`: Double (Alcohol by Volume).

### Detailed Sensory Fields (StyleDetailDto)
- `notes`: Text. General description and historical context.
- `aroma`: Text. Expected aromatic profile.
- `appearance`: Text. Visual expectations (clarity, head retention).
- `flavor`: Text. Taste characteristics.
- `mouthfeel`: Text. Body, carbonation, and aftertaste.

### 🌟 Serving & Extra Info (Enrichment)
- `glassware`: String. Recommended glass type (e.g., "Tulip", "Nonic Pint", "Pilsner Glass").
- `servingTempMin / servingTempMax`: Double (°C). Ideal temperature range for tasting.
- `commercialExamples`: Text. Notable beers that represent this style perfectly.

---

## 2. Navigation & UI Integration
The Style domain is accessible through two main paths:

### Primary Navigation (Main Menu)
- A new **"Styles"** tab will be added to the main application navigation.
- **Style Explorer:** A dedicated screen allowing users to browse, search, and filter the entire BJCP catalog.
- **Filtering:** Filter by category (e.g., "IPA", "Lager") or by technical traits (e.g., "High ABV").

### Recipe Contextual Integration
- **Creation/Edition:** Each `Recipe` can be linked to a `Style` via a `styleId` (Long).
- **Searchable Selection:** A `SearchableSelect` component will be added to the recipe header form, allowing brewers to search for a style by name while creating or editing a recipe.
- **Initial Choice:** Setting a style during creation will automatically set the target technical ranges for the recipe's validation gauges.

### Visual Validation (UI/UX)
When a style is selected in a recipe, the frontend will use the technical ranges to provide real-time feedback:
- **Gauges:** The current `RangeGauge` component will use the Style's `min/max` as the "safe zone" (green).
- **Style Alignment:** If a recipe metric (e.g., IBU) falls outside the style range, the UI should indicate the discrepancy.
- **Service Guide:** Display the recommended glassware and temperature on the recipe detail page as a "Brewmaster's Tip".

---

## 3. Data Seeding
Data is extracted from `styles.json` using the [BeerProto](https://github.com/beerproto/dataset) dataset.
- **Conversion:** `scripts/convert_beerproto.py` will parse the complex nested JSON.
- **Enrichment:** Some fields (glassware, serving temp) might be extracted from descriptions using regex or added from auxiliary datasets if missing in the core JSON.
- **Import:** High-performance SQL import via Liquibase `sqlFile`.

---

## 4. API Endpoints
- `GET /api/styles?name={query}`: Returns a Page of `StyleDto`.
- `GET /api/styles/{id}`: Returns a complete `StyleDetailDto`.
