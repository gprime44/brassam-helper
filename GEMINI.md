# Brassam Helper - AI Context & Guidelines

## 🏗️ Architecture & Domain Isolation
- **Database:** SQLite is used for persistence. The database file is stored in `data/brassam.db` (mapped to a volume in Docker).
- **Domain Decoupling:** Every domain (Inventory, Recipe, etc.) must remain strictly isolated. 
- **Entity Relationships:** Avoid JPA relationships (`@ManyToOne`, `@OneToMany`) across domains and even within a domain aggregate if it increases complexity. Prefer storing simple Foreign Keys (IDs).
- **DTO Standards:** DTOs must never duplicate data from other domains. A `RecipeDto` contains only references (IDs) to `Inventory` items. Data enrichment (names, technical specs) must be handled by the Service layer for calculations or by the Frontend for display.
- **Service Validation:** When adding a reference to another domain (e.g., adding a Hop to a Recipe), existence must be verified using the dedicated Service of the target domain.

## 🚀 DevOps & Automation
- **Git & Push Protocol:** **CRITICAL:** Never `git commit`, `git push`, or push Docker images to the hub without an explicit request from the user. Every external action must be validated by a direct directive.
- **Build Strategy:** Use the local Python script `scripts/build_and_push.py` for consistent builds. It leverages local Gradle/NPM to bypass corporate SSL proxy issues inside Docker containers.

## 🎨 UI & UX Standards
- **Responsiveness:** All features (especially complex forms like Recipe edition) must be fully responsive (Mobile First). 
- **Ingredient Lists:** Avoid horizontal scrolling on tables. Prefer responsive grid/flex cards (`ingredient-item-card`) that stack vertically on mobile and align horizontally on desktop.
- **Selection:** Use the `SearchableSelect` component for large lists (Hops, Fermentables, Yeasts). It supports paginated server-side searching and editing initial values.
- **Visual Identity:** Follow the established style:
  - Modern cards with shadows.
  - Color-coded badges for stats (ABV, IBU, EBC).
  - Use of emojis/icons for category identification.
  - Consistent use of CSS variables defined in `index.css`.
- **Button Harmonization:** Use standardized CSS classes for buttons:
  - `.btn.btn-primary`: Main actions (Add, Create).
  - `.btn.btn-outline`: Secondary/Edit actions.
  - `.btn.btn-danger`: Delete actions.
  - `.btn.btn-sm`: Compact version for list items.
  - Avoid inline styles for button appearance.

## 🧪 Testing Strategy & TDD
- **TDD is MANDATORY:** Every development or bug fix must follow the Test Driven Development cycle:
  1. **Research & Reproduction:** Understand the need or reproduce the bug.
  2. **Test Failure:** Write a new test case (E2E or Unit) that fails.
  3. **Implementation:** Write the minimum code necessary to make the test pass.
  4. **Validation:** Ensure all tests pass.
- **Testing Trophy:** Follow the Static > Unit > Integration > E2E hierarchy.
- **E2E Coverage:** Every REST endpoint must be covered by at least one E2E test in the Controller layer.
- **Calculations:** Sensitive brewing formulas (Tinseth, Morey) must have dedicated unit tests.
