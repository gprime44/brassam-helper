# Domain: Inventory

This domain manages the catalog of ingredients available for brewing. It serves as the reference database for calculating recipe metrics.

## 🏗️ Architecture: DTO Split
To keep the application fast and responsive (especially on mobile), we use two types of Data Transfer Objects:
1. **Search/List DTOs:** Lightweight objects containing only the strictly necessary fields for identification and high-level categorization.
2. **Detail DTOs:** Complete objects containing all technical specifications, producer info, and notes, used only on dedicated detail pages.

---

## 1. Fermentables
Used for calculating Original Gravity (OG), Color (EBC), and Malt Bill impact.

### Search Fields (Lightweight)
- `name`: String.
- `type`: Enum (GRAIN, SUGAR, FRUIT, EXTRACT, ADJUNCT).
- `colorEbc`: Double. Color impact in EBC units.
- `yieldPercentage`: Double. Relative extract efficiency (%).
- `protein`: Double. Protein content (%).

### Detail Fields (Additional)
- `producer`: String. Name of the maltster/manufacturer.
- `origin`: String. Country or region of origin.
- `notes`: Text. Usage recommendations and flavor profile.
- `moisture`: Double (%).
- `diastaticPower`: Double (°Lintner/WK).
- `fan`: Double (Free Amino Nitrogen).
- `betaGlucan`: Double (mg/L).

---

## 2. Hops
Used for calculating Bitterness (IBU) and Aroma profile.

### Search Fields (Lightweight)
- `name`: String.
- `alphaAcid`: Double (%).
- `origin`: String.

### Detail Fields (Additional)
- `betaAcid`: Double (%).
- `notes`: Text. Aroma and flavor description (e.g., "Citrusy, floral").
- `substitutes`: String. List of similar hops.
- `totalOil`: Double (ml/100g).
- **Oil Breakdown (%)**: `myrcene`, `humulene`, `cohumulone`, `caryophyllene`, `farnesene`.

---

## 3. Yeasts
Used for calculating Final Gravity (FG) and Alcohol Content (ABV).

### Search Fields (Lightweight)
- `name`: String.
- `attenuationMin`: Double (%).
- `attenuationMax`: Double (%).
- `type`: Enum (ALE, LAGER, KVEIK, etc.).
- `alcoholTolerance`: Double (ABV %).

### Detail Fields (Additional)
- `producer`: String.
- `productId`: String. Manufacturer's code (e.g., US-05, WLP001).
- `flocculation`: Enum (LOW, MEDIUM, HIGH).
- `tempMin / tempMax`: Double (°C). Recommended fermentation range.
- `notes`: Text. Detailed behavior and flavor characteristics.
- `bestFor`: String. Recommended beer styles.

---

## 4. Data Seeding
The inventory is pre-populated with standard data from [beerproto/dataset](https://github.com/beerproto/dataset).
- **Process:** A Python script `scripts/convert_beerproto.py` extracts raw JSON data into enriched CSV files.
- **Import:** Liquibase `loadData` handles the database population.
- **Update Strategy:** For major schema changes, the database is cleared and re-imported to ensure data integrity across all detailed fields.

---

## 5. API Endpoints
- `GET /api/fermentables?name={query}`: Returns a Page of lightweight `FermentableDto`.
- `GET /api/fermentables/{id}`: Returns a complete `FermentableDetailDto`.
- `GET /api/hops?name={query}`: Returns a Page of lightweight `HopDto`.
- `GET /api/hops/{id}`: Returns a complete `HopDetailDto`.
- `GET /api/yeasts?name={query}`: Returns a Page of lightweight `YeastDto`.
- `GET /api/yeasts/{id}`: Returns a complete `YeastDetailDto`.
