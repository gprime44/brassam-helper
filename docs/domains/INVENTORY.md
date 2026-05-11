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
