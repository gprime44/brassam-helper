# Brassam Helper - Brewing Management Project

## Project Overview
Brassam Helper is a web application designed for homebrewers to manage recipes, batches, and inventory. It provides tools for calculating key indicators (IBU, EBC, ABV) and features a step-by-step brewing assistant.

## Tech Stack

### Backend
- **Language:** Java 25 (configured via toolchain)
- **Framework:** Spring Boot 4.0
- **Database:** MariaDB (Default/Production), H2 (Development)
- **Database Migration:** Liquibase (YAML format)
- **Dependency Management:** Gradle (Kotlin DSL)

### Frontend
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Prioritizing simplicity and performance)

## Architecture
The project is structured as a monorepo:
- `/backend`: Spring Boot application.
  - **Pattern:** Package by Feature (each package groups entities, repositories, services, and controllers related to a feature).
- `/frontend`: React application.
  - **Pattern:** Component-based architecture (CSS files and tests co-located with components).
- `/docs`: Technical and functional documentation.
  - `/docs/features`: Detailed specifications for each feature.

## Key Features
1. **Recipe Management:** Detailed specs in [RECIPE_MANAGEMENT.md](docs/features/RECIPE_MANAGEMENT.md).
2. **Brewing Assistant:**

   - Planning and scheduling.
   - Mashing / Sparging / Boiling phases.
   - Fermentation / Dry Hopping.
   - Priming / Bottling.
3. **Inventory:**
   - Stock tracking for malts, hops, and yeasts.

## Development Workflow

### Starting the Backend
A custom Gradle task is available to start the backend with a development profile:
```bash
# From /backend directory
./gradlew start
```
This command activates the `dev` Spring profile, which uses an in-memory **H2 database** and enables the H2 console at `/h2-console`.

For production or local testing with **MariaDB**, use the standard Spring Boot run task:
```bash
./gradlew bootRun
```

### Configuration
All configuration files use the **YAML** format:
- `application.yml`: Main configuration (MariaDB).
- `application-dev.yml`: Development overrides (H2).

### Database Migrations
All schema changes must be implemented via Liquibase changelogs located in `backend/src/main/resources/db/changelog/`.
- `db.changelog-master.yaml`: Entry point for all changelogs.
- `db.changelog-X.Y.yaml`: Versioned changelog files.

## Conventions and Standards
- **Units:** Systematic use of the International System of Units (SI) or accepted derived units:
  - **Volume:** Liters (L).
  - **Mass:** Kilograms (kg) for grains, Grams (g) for hops and additives.
  - **Temperature:** Celsius (°C).
  - **Pressure:** Bar or Pascal (Pa).
  - **Density:** Specific Gravity (SG - ratio) or Plato (°P).
- **API:** RESTful with OpenAPI/Swagger documentation.
- **CSS Style:** Use CSS Variables for theming. No external CSS frameworks unless explicitly requested.
- **Testing:** JUnit 5 for the backend, Vitest for the frontend.
