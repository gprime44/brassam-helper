# Recipe Management Specifications

This document details the data models and logic required for the Recipe Management feature.

## Base Components

To support accurate recipe calculations, the system relies on three primary ingredient databases.

### 1. Fermentables Base
Used for calculating Original Gravity (OG), Color (EBC), and Malt Bill impact.
- **Fields:**
  - `name`: String.
  - `type`: Enum. (GRAIN, SUGAR, FRUIT, EXTRACT, ADJUNCT).
  - `colorEbc`: Double. Color impact in EBC units.
  - `potentialPercentage`: Double. Theoretical maximum extract percentage (%). Replaces PPG.
  - `yieldPercentage`: Double. Relative extract efficiency (%).

### 2. Yeast Base
Used for calculating Final Gravity (FG) and Alcohol Content (ABV).
- **Fields:**
  - `name`: String.
  - `attenuation`: Double. Percentage (%).
  - `type`: Enum.
  - `format`: Enum.

### 3. Hop Base
Used for calculating Bitterness (IBU).
- **Fields:**
  - `name`: String.
  - `type`: Enum.
  - `alphaAcid`: Double. Percentage (%).

## Calculations & Formulas (SI Units)

Based on [Le Wiki du Brassage Amateur](https://www.brassageamateur.com/wiki/Formules).

### 1. Bitterness (IBU) - Tinseth Formula
$$IBU = [ 1.65 \times 0.000125^{(density - 1)} ] \times [ \frac{1 - \exp(-0.04 \times time)}{4.15} ] \times \frac{alphaAcid \times mass_{grams} \times 1000}{volume_{liters}}$$

### 2. Color (EBC) - Morey Formula
$$EBC = 2.9396 \times ( 4.23 \times \frac{\sum (EBC_{grain} \times mass_{kg})}{volume_{liters}} )^{0.6859}$$

### 4. Gravity & Efficiency
- **Extract Potential ($E$):** $E = mass_{kg} \times potential\% \times efficiency\%$
- **Pre-boil Density:** $D = 1 + \frac{\text{Constant} \times \sum E}{volume_{liters}} / 1000$

## Data Seeding Plan

To provide a functional application out-of-the-box, the database will be seeded with ~100 common ingredients.

### 1. Data Sources
- **Primary Source:** [beerproto/dataset](https://github.com/beerproto/dataset) (JSON reference data for Hops, Fermentables, and Yeasts).
- **Secondary Source:** [BeerXML.com](http://www.beerxml.com/) (Legacy reference lists).

### 2. CSV Schema (SI Units)
Data will be consolidated into three CSV files located in `backend/src/main/resources/db/data/`.

#### fermentables.csv
`name,type,color_ebc,potential_percentage,yield_percentage`
- *Example:* `Pilsner Malt,GRAIN,3.5,80.0,75.0`

#### hops.csv
`name,type,alpha_acid`
- *Example:* `Cascade,PELLET,6.5`

#### yeasts.csv
`name,attenuation,type,format`
- *Example:* `SafAle S-04,75.0,ALE,DRY`

### 3. Implementation via Liquibase
The seeding will be performed using the Liquibase `loadData` change type in a dedicated changelog:
```yaml
databaseChangeLog:
  - changeSet:
      id: seed-base-ingredients
      author: gemini
      changes:
        - loadData:
            tableName: fermentable
            file: db/data/fermentables.csv
        - loadData:
            tableName: hop
            file: db/data/hops.csv
        - loadData:
            tableName: yeast
            file: db/data/yeasts.csv
```
