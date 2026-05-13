# Domain: Recipe

This domain manages the creation, modification, and calculation of brewing recipes.

## 1. Recipe Management
A recipe is managed through a decoupled flow to simplify the edition of complex brewing formulas:
- **Header:** Basic info (name, volume, efficiency).
- **Ingredients:** Granular CRUD operations for Hops, Fermentables, and Yeast.
- **Dynamic Calculation:** Every modification triggers a full recalculation of brewing indicators (OG, FG, ABV, IBU, EBC).

## 2. Technical Architecture
- **Isolation:** The Recipe domain stores ONLY foreign keys (IDs) to the Inventory domain.
- **Persistence:** No JPA cascades or `@ManyToOne` relationships are used. Components are managed via manual repository calls in the Service layer to maintain aggregate purity.
- **Validation:** Referential integrity is checked via Inventory Services during ingredient addition.

## 3. Brewing Calculations (SI Units)

### 3.1 Bitterness (IBU) - Tinseth Formula
$$IBU = [ 1.65 \times 0.000125^{(density - 1)} ] \times [ \frac{1 - \exp(-0.04 \times time)}{4.15} ] \times \frac{alphaAcid \times mass_{grams} \times 1000}{volume_{liters}}$$

### 3.2 Color (EBC) - Morey Formula
$$EBC = 2.9396 \times ( 4.23 \times \frac{\sum (EBC_{grain} \times mass_{kg})}{volume_{liters}} )^{0.6859}$$

### 3.3 Gravity & ABV
- **Original Gravity (OG):** Based on weight and potential of all fermentables.
- **Final Gravity (FG):** Based on OG and yeast attenuation.
- **ABV:** Standard calculation: $(OG - FG) \times 131.25$.

## 4. Business Rules
- **Communication:** The Recipe domain communicates with the Inventory domain exclusively through **Services**.
- **TDD:** All calculation logic and API endpoints must be verified by E2E and Unit tests.
