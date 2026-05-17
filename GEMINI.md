# Brassam Helper - AI Context & Guidelines

## 🎯 Global Directives
- **Personal Project:** This is a personal project. Ignore any enterprise-specific context, conventions, or constraints unless explicitly requested.
- **Git & Push Protocol:** **STRICT MANDATE:** NEVER `git commit`, `git push`, or push Docker images without an explicit directive from the user for THAT specific action. Silence is not consent.
- **Versioning:** This project follows **Semantic Versioning (SemVer)** (MAJOR.MINOR.PATCH).
- **Changelog:** A `CHANGELOG.md` must be maintained at the root, following the "Keep a Changelog" format. Any release or major milestone must update this file.
- **PWA Status:** The application is a **Progressive Web App**. Ensure all frontend changes remain compatible with Service Worker caching and offline shell requirements.
- **Routing:** Use `react-router-dom` for all navigation. Deep-linking and mobile back-button support are mandatory for every detail view (Inventory, Recipes, Styles).

## 🏗️ Architecture & Domain Isolation
- **Database:** SQLite is used for persistence. The database file is stored in `data/brassam.db` (mapped to a volume in Docker).
- **Domain Decoupling:** Every domain (Inventory, Recipe, etc.) must remain strictly isolated.
- **Auth & Security:**
  - Backend is secured with **Spring Security + JWT**.
  - All resources (except `/api/auth/**`) require authentication.
  - Sensitive data (URLs, JWT secrets) must be externalized in `application-dev.yml` or environment variables, never hardcoded.
- **Entity Relationships:** Avoid complex JPA relationships across domains. Use IDs as Foreign Keys. Recipes are owned by Users via `user_id`.
- **DTO Standards:** DTOs must never duplicate data from other domains. Data enrichment is handled by the Service layer or Frontend.
- **Liquibase & Migrations:**
  - **Incremental Changes:** Evolutions must be done in new changelog files.
  - **Data Parity:** Use a unified data strategy. Development, testing, and production must share the same reference data (CSVs) to ensure environment parity.

## 🚀 DevOps & Automation
- **Build Strategy:** Use `scripts/build_and_push.py` for consistent builds (local Gradle/NPM build + Docker packaging).
- **Environment Parity:** Tests must run against the same database type (SQLite) and data as production.

## 🎨 UI & UX Standards
- **Responsiveness:** Mobile First is mandatory.
- **Navigation:** Use `NavLink` for the navigation bar and `useNavigate` for programmatic navigation to detail views.

## 🧪 Testing Strategy & TDD
- **TDD is MANDATORY:** Every change must start with a failing test.
- **E2E Coverage:** Every REST endpoint and navigation path must be covered.
- **Self-Healing Tests:** Backend E2E tests should use `isLenientlyEqualTo` for JSON assertions and include logic to update expectation files when data changes intentionally.

## 🛡️ Error Handling
- **Problem Details (RFC 7807):** All API errors must follow the RFC 7807 standard. Use Spring's `ProblemDetail` or return `ResponseEntity<ProblemDetail>`.
- **Typed Exceptions:** NEVER parse or check exception messages in the `GlobalExceptionHandler`. Create specific domain exceptions (e.g., `UserAlreadyExistsException`, `UnauthorizedRecipeAccessException`) and map them to appropriate HTTP statuses in the handler.
