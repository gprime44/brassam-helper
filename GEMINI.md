# Brassam Helper - Projet de gestion de brassage

## Aperçu du projet
Brassam Helper est une application web destinée aux brasseurs amateurs pour gérer leurs recettes, leurs brassins et leur inventaire. L'outil permet de calculer les indicateurs clés (IBU, EBC, ABV) et propose un assistant de brassage pas à pas.

## Pile Technologique

### Backend
- **Langage :** Java 21+
- **Framework :** Spring Boot 4.0
- **Base de données :** MariaDB
- **Migration de base de données :** Liquibase
- **Gestionnaire de dépendances :** Gradle (Kotlin DSL)

### Frontend
- **Framework :** React (via Vite)
- **Langage :** TypeScript
- **Stylisation :** Vanilla CSS (priorité à la simplicité et aux performances)

## Architecture
Le projet est structuré en monorepo :
- `/backend` : Application Spring Boot.
  - **Pattern :** Package by Feature (chaque package regroupe entités, repositories, services et contrôleurs liés à une fonctionnalité).
- `/frontend` : Application React.
  - **Pattern :** Architecture basée sur les composants (fichiers CSS et tests colocalisés avec les composants).
- `/docs` : Documentation technique et fonctionnelle.

## Fonctionnalités Clés
1. **Gestion des Recettes :**
   - Calcul automatique de l'IBU (Amertume).
   - Calcul de l'EBC (Couleur).
   - Estimation de l'ABV (Alcool).
2. **Assistant de Brassage :**
   - Planification.
   - Empâtage / Rinçage / Ébullition.
   - Fermentation / Dry Hop.
   - Sucrage / Conditionnement.
3. **Inventaire :**
   - Suivi des stocks de malts, houblons et levures.

## Conventions et Standards
- **API :** RESTful avec documentation OpenAPI/Swagger.
- **Base de données :** Toutes les modifications de schéma doivent passer par Liquibase (`src/main/resources/db/changelog`).
- **Style CSS :** Utilisation de CSS Variables pour le thème. Pas de framework CSS externe (sauf demande explicite).
- **Tests :** JUnit 5 pour le backend, Vitest pour le frontend.
