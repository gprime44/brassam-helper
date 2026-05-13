# Brassam Helper - AI Context & Guidelines

## 🏗️ Architecture & Domain Isolation
- **Database:** SQLite is used for persistence. The database file is stored in `data/brassam.db` (mapped to a volume in Docker).
- **Domain Decoupling:** Every domain (Inventory, Recipe, etc.) must remain strictly isolated. 
- **Entity Relationships:** Avoid JPA relationships (`@ManyToOne`, `@OneToMany`) across domains and even within a domain aggregate if it increases complexity. Prefer storing simple Foreign Keys (IDs).
- **DTO Standards:** DTOs must never duplicate data from other domains. A `RecipeDto` contains only references (IDs) to `Inventory` items. Data enrichment (names, technical specs) must be handled by the Service layer for calculations or by the Frontend for display.
- **Service Validation:** When adding a reference to another domain (e.g., adding a Hop to a Recipe), existence must be verified using the dedicated Service of the target domain.

## 🚀 DevOps & Automation
- **Build Strategy:** Use the local Python script `scripts/build_and_push.py` for consistent builds. It leverages local Gradle/NPM to bypass corporate SSL proxy issues inside Docker containers.
- **Docker Images:** 
  - Backend: `gprime44/helper-backend:latest`
  - Frontend: `gprime44/helper-frontend:latest`
- **Push Protocol:** **CRITICAL:** Never execute the push script automatically. Only push to Docker Hub upon explicit user request.

## 🎨 UI & UX Standards
- **Responsiveness:** All features (especially complex forms like Recipe edition) must be fully responsive (Mobile First). Use horizontal scrolling for large tables on small screens.
- **Visual Identity:** Follow the established style:
  - Modern cards with shadows.
  - Color-coded badges for stats (ABV, IBU, EBC).
  - Use of emojis/icons for category identification.
  - Consistent use of CSS variables defined in `index.css`.

## 🧪 Testing Strategy
- **Testing Trophy:** Follow the Static > Unit > Integration > E2E hierarchy.
- **E2E Coverage:** Every REST endpoint must be covered by at least one E2E test in the Controller layer.
- **Calculations:** Sensitive brewing formulas (Tinseth, Morey) must have dedicated unit tests.
