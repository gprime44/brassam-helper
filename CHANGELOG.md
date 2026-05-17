# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-17

### Added
- **Security:** Full backend protection using Spring Security and JWT.
- **Auth:** User management with Signup and Login endpoints.
- **Database:** Linked Recipes to authenticated Users.
- **Frontend:** Progressive Web App (PWA) support with offline shell.
- **Frontend:** Client-side routing with `react-router-dom` for deep-linking and mobile history support.
- **Testing:** Comprehensive E2E test suite for Auth, Inventory, Styles, and Recipes with self-healing JSON expectations.

### Changed
- **Database:** Unified Liquibase strategy (same data for dev, test, and prod).
- **Architecture:** Centralized CORS configuration and externalized security properties.
- **DevExp:** Suppressed JVM and JPA warnings at startup.

### Fixed
- **CORS:** Resolved conflicts between global config and local `@CrossOrigin` annotations.
- **Liquibase:** Fixed SQLite compatibility for UUID types and foreign key constraints.

---
[0.1.0]: https://github.com/gprime44/brassam-helper/releases/tag/v0.1.0
