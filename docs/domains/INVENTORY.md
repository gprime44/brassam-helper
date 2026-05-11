# Domain: Inventory

This domain manages the catalog of ingredients available for brewing. It serves as the reference database for calculating recipe metrics.

## 1. Fermentables
Used for calculating Original Gravity (OG), Color (EBC), and Malt Bill impact.
- **Fields:**
  - `name`: String.
  - `type`: Enum (GRAIN, SUGAR, FRUIT, EXTRACT, ADJUNCT).
  - `colorEbc`: Double. Color impact in EBC units.
  - `yieldPercentage`: Double. Relative extract efficiency (%).
  - `protein`: Double. Protein content (%).

## 2. Hops
Used for calculating Bitterness (IBU).
- **Fields:**
  - `name`: String.
  - `alphaAcid`: Double. Percentage (%).
  - `origin`: String.

## 3. Yeasts
Used for calculating Final Gravity (FG) and Alcohol Content (ABV).
- **Fields:**
  - `name`: String.
  - `attenuationMin`: Double (%).
  - `attenuationMax`: Double (%).
  - `type`: Enum (ALE, LAGER, KVEIK, etc.).
  - `alcoholTolerance`: Double (ABV %).

## 4. Data Seeding
The inventory is pre-populated with standard data from [beerproto/dataset](https://github.com/beerproto/dataset).
- Files: `backend/src/main/resources/db/data/{fermentables,hops,yeasts}.csv`
- Implementation: Automated via Liquibase `loadData`.

## 5. Frontend Features
The inventory screen is designed with a **mobile-first** approach.

### Key Features:
- **Search:** Real-time search with a 300ms debounce to filter ingredients by name.
- **Categorization:** Tabs to switch between Fermentables (Grain), Hops, and Yeasts.
- **Details View:** Clicking on an item navigates to a dedicated details page showing all ingredient characteristics.
- **API Integration:** Connects to the Spring Boot backend via a Vite proxy.
- **Responsive Layout:** Optimized for mobile with a fixed bottom navigation bar and centered view on desktop.

### API Endpoints:
- `GET /api/fermentables?name={query}`: List and search fermentables.
- `GET /api/fermentables/{id}`: Get details of a specific fermentable.
- `GET /api/hops?name={query}`: List and search hops.
- `GET /api/hops/{id}`: Get details of a specific hop.
- `GET /api/yeasts?name={query}`: List and search yeasts.
- `GET /api/yeasts/{id}`: Get details of a specific yeast.

## 6. Implementation Notes
- **Data Cleaning:** The yeast dataset was cleaned to convert complex JSON strings (e.g., `{'value': 76, 'unit': 'PERCENT_SIGN'}`) into plain numeric values for database compatibility.
- **Proxy Configuration:** Vite is configured to proxy `/api` requests to `http://localhost:8080`.
