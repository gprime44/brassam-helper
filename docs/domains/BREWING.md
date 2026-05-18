# Domain: Brewing

This domain manages the execution of brewing recipes, tracking sessions from brew day to bottling or kegging. It bridges the gap between theoretical recipes and real-world results.

## 🏗️ Architecture: DTO Split
To optimize the dashboard and batch list performance:
1. **BrewingSessionDto (Summary):** ID, Batch Name, Status, Recipe Name, Planned/Actual Brew Date.
2. **BrewingSessionDetailDto (Complete):** Includes all measurements, fermentation logs, recipe snapshots, and efficiency calculations.

---

## 1. Brewing Session (Batch)

### Core Identity
- `id`: Long. Internal identifier.
- `name`: String. Name of the batch (defaults to Recipe Name + Date).
- `status`: Enum. (PLANNED, MASHING, BOILING, FERMENTING, CONDITIONING, FINISHED, ABORTED).
- `recipeId`: Long. Reference to the source recipe.
- `userId`: Long. Reference to the owner of the batch.

### 📅 Lifecycle & Dates
- `plannedDate`: Date. Scheduled brew day.
- `brewDate`: Date. Actual date the beer was brewed.
- `bottlingDate`: Date. When the batch was packaged.
- `endDate`: Date. When the batch was finished or archived.

### 📊 Real Measurements (Logs)
- **Water:** `strikeWaterVolume` (L), `spargeWaterVolume` (L), `mashPh` (Measured).
- **Pre-Boil:** `preBoilVolume` (L), `preBoilGravity` (SG).
- **Post-Boil (Kettle):** `batchVolume` (L), `originalGravity` (OG), `boilOffRate` (L/h).
- **Losses:** `trubLoss` (L), `transferLoss` (L).
- **Packaging:** `finalGravity` (FG), `bottledVolume` (L).
- **Calculated Metrics:** `actualEfficiency`, `actualAbv`, `actualAttenuation`.

### 🛡️ Recipe Snapshot & Substitutions
To ensure historical accuracy, a batch snapshots the recipe. However, real-world constraints often require adjustments:
- **Snapshot:** `targetOg`, `targetFg`, `targetIbu`, `targetEbc`, `targetAbv`, `targetBatchSize`.
- **Substitutions:** Ability to log the *actual* ingredient used (e.g., "Citra Lot #2024" instead of generic "Citra") or a replacement (e.g., "Columbus" instead of "Magnum").
- **Lot Tracking:** Link specific ingredients to inventory lot numbers for traceability.

---

## 2. Fermentation & Conditioning

### Reading Fields
- `id`: Long.
- `timestamp`: DateTime.
- `gravity`: Double (SG).
- `temperature`: Double (°C).
- `notes`: Text.

### 🌿 Cold Side Events
- **Dry-Hopping:** Start date, removal date, and actual amount added.
- **Additions:** Fining agents (Gelatin), fruit additions, or wood aging.
- **Profile:** Target fermentation schedule (e.g., 18°C for 4 days, then D-Rest at 21°C).

---

## 3. Sensory Evaluation (Tasting)
Once the beer is ready, the brewer evaluates the final result.

### Evaluation Fields
- **Overall Score:** Integer (0-50).
- **Off-Flavors Checklist:** (DMS, Diacetyl, Oxidation, Acetaldehyde, Phenolic, etc.).
- **Sensory Notes:** Aroma, Appearance, Flavor, Mouthfeel.
- **Conclusion:** Enum (`REPLICATE`, `ADJUST`, `ABANDON`).
- **Adjustment Tips:** Text.

---

## 4. Carbonation & Packaging

### Packaging Data
- **Method:** `BOTTLED` or `KEGGED`.
- **Priming:** Type of sugar (Glucose, Table Sugar, DME), amount added (g), and resulting CO2 volumes.
- **Temperature:** Conditioning temperature.

---

## 5. Calculations & Logic

### Actual Efficiency
$$Efficiency_{actual} = \frac{Volume_{measured} \times (OG_{measured} - 1) \times ScalingFactor}{\sum (Potential \times Mass_{grain})}$$

### ABV (Alcohol by Volume)
Includes correction for priming sugar if bottled.
$$ABV_{actual} = ((OG - FG) \times 131.25) + ABV_{priming}$$

### Apparent Attenuation
$$Attenuation = \frac{OG - FG}{OG - 1} \times 100$$

---

## 5. Brewing Lifecycle & Checklists

The brewing process is a linear workflow supported by **Interactive Checklists** to ensure no critical step is missed.

### 🟢 Stage 1: Planning (`PLANNED`)
- **Action:** User selects a recipe and sets a `plannedDate`.
- **Data:** Targets are snapshotted from the recipe.
- **Goal:** Ensure all ingredients are available in stock.

### 🟠 Stage 2: Brew Day (`BREWING`)
The active process of making the wort. This stage uses a **Live Checklist**:
1. **Preparation:** [ ] Mill grains, [ ] Heat strike water, [ ] Treat water (salts/acid), [ ] Sanitize fermenter.
2. **Mashing:** [ ] Dough in, [ ] Check temperature, [ ] Check mash pH, [ ] Mash-out.
3. **Boiling:** [ ] First hop addition, [ ] Fining agents (Irish Moss), [ ] Late hop additions.
4. **Post-Boil:** [ ] Chill wort, [ ] Aerate, [ ] Pitch yeast.

- **Data Capture:** During this phase, the user logs **Pre-boil** and **Post-boil** measurements.
- **Inventory Hook:** Final deduction of ingredients from stock happens when the checklist is completed.

### 🔵 Stage 3: Fermentation (`FERMENTING`)
- **Action:** Yeast converts sugar to alcohol.
- **Data:** User logs regular **Gravity Readings** and **Temperature**.
- **Events:** Optional "Dry Hopping" or "Fruit addition" can be logged as events in the fermentation timeline.

### 🟣 Stage 4: Conditioning (`CONDITIONING`)
- **Action:** The beer clears and matures.
- **Data:** Cold crashing (dropping temperature to clarify) and aging.
- **Goal:** Reaching a stable **Final Gravity (FG)**.

### ⚪ Stage 5: Packaging & Finishing (`FINISHED`)
- **Action:** Bottling or kegging.
- **Data:** `bottlingDate` and final volume packaged.
- **Evaluation:** The **Sensory Evaluation** is performed at this stage (after proper carbonation).

---

## 6. UX Principles: The Brewer's Copilot

The brewing interface is designed as an active assistant rather than a static form. It follows these core principles:

- **Step-by-Step Guidance:** The UI only shows the current and next task to prevent cognitive overload during a busy brew day.
- **Just-in-Time Data Entry:** Input fields (like pre-boil gravity) appear only when the workflow reaches the relevant stage.
- **Mobile-First & Resilient:** Large touch targets for wet/gloved hands. The application state is persisted to the backend after every checkbox/input, allowing the brewer to switch devices or refresh without losing progress.
- **Visual Timers:** Integrated timers for mash rests and boil additions with clear visual/auditory cues.
- **Recipe-to-Process Link:** The checklist is dynamically generated from the recipe's mash profile and hop schedule.

---

## 7. UI Integration & Batch Lifecycle

### Dashboard Integration
- **Active Batches Widget:** Displays sessions in `BREWING`, `FERMENTING`, or `CONDITIONING` status.
- **Timeline View:** A visual tracker showing the progress of a batch through its lifecycle.

### Batch Detail Page
- **Comparison Gauges:** Visual comparison between Recipe Targets (Snapshot) and Real Measurements.
- **Fermentation Graph:** A line chart plotting Gravity and Temperature over time.
- **Interactive Checklist:** A dedicated tab for the Brew Day to track progress in real-time.
- **Tasting Card:** A summary of the sensory evaluation displayed next to the final stats.

### 📦 Inventory Interaction
When a batch moves to the `BREWING` status:
- **Deduction:** The application calculates the required amount of ingredients based on the recipe and deducts them from the Inventory stock (future implementation).

---

## 7. API Endpoints
- `GET /api/brewing`: List all batches (supports filtering by status).
- `GET /api/brewing/{id}`: Full batch details including readings and checklist.
- `POST /api/brewing`: Create a new batch from a `recipeId`.
- `PATCH /api/brewing/{id}`: Update batch status, measurements, or tasting notes.
- `POST /api/brewing/{id}/readings`: Add a new fermentation reading.
- `PATCH /api/brewing/{id}/checklist`: Update the state of brew day tasks.

---

## 8. Business Rules
- **Data Integrity:** `FG` cannot be logged if the status is `PLANNED` or `BREWING`.
- **Status Flow:** Status transitions must follow a logical order.
- **Tasting Visibility:** Sensory fields are only editable once the batch reaches the `FINISHED` status.
- **TDD:** Fermentation tracking, checklist state persistence, and ABV/Efficiency calculation logic must be strictly tested.
- **Isolation:** Stores `recipe_id` and `user_id` as foreign keys to maintain multi-user security.
