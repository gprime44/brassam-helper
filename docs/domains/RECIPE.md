# Domain: Recipe

This domain manages the creation, modification, and calculation of brewing recipes.

## 1. Recipe Creation
A recipe is built by associating ingredients from the **Inventory** domain with specific quantities and usage details.

### 1.1 Core Attributes
- `name`: String (Required).
- `batchVolume`: Double (Liters, Default: 20L).
- `efficiency`: Double (Percentage, Default: 75%).

### 1.2 Ingredient Additions
- **Fermentables:** Quantity in **grams**.
- **Hops:** Quantity in **grams**, phase (BOIL, HOPSTAND, DRY_HOP), and duration in **minutes**.
- **Yeast:** Quantity in **grams**.

## 2. Brewing Calculations (SI Units)
The system MUST update these metrics in real-time as ingredients are modified.

### 2.1 Bitterness (IBU) - Tinseth Formula
$$IBU = [ 1.65 \times 0.000125^{(density - 1)} ] \times [ \frac{1 - \exp(-0.04 \times time)}{4.15} ] \times \frac{alphaAcid \times mass_{grams} \times 1000}{volume_{liters}}$$

### 2.2 Color (EBC) - Morey Formula
$$EBC = 2.9396 \times ( 4.23 \times \frac{\sum (EBC_{grain} \times mass_{kg})}{volume_{liters}} )^{0.6859}$$

### 2.3 Gravity & ABV
- **Original Gravity (OG):** Based on weight and potential of all fermentables.
- **Final Gravity (FG):** Based on OG and yeast attenuation.
- **ABV:** Standard calculation: $(OG - FG) \times 131.25$.

## 3. Business Rules
- **Isolation:** The Recipe domain communicates with the Inventory domain exclusively through **Services**.
- **TDD:** All calculation logic and API endpoints must be verified by E2E and Unit tests.
