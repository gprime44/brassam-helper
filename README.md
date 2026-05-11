# Brassam Helper 🍺

Brassam Helper est une application moderne d'aide au brassage amateur, conçue pour gérer l'inventaire des ingrédients (malts, houblons, levures) et faciliter la création de recettes.

## 🚀 Fonctionnalités

- **Gestion de l'Inventaire :** Catalogue complet de fermentables, houblons et levures.
- **Recherche temps-réel :** Recherche fluide avec debounce pour trouver rapidement vos ingrédients.
- **Détails Techniques :** Fiches détaillées pour chaque ingrédient (EBC, % Alpha, Atténuation, etc.).
- **Interface Mobile-First :** Design responsive optimisé pour une utilisation en cuisine ou en brasserie.
- **Internationalisation :** Support complet du Français et de l'Anglais.

## 🛠️ Stack Technique

### Backend
- **Langage :** Java 25
- **Framework :** Spring Boot 4.0.6
- **Base de données :** MariaDB 11 (ou H2 en mode dev)
- **Migration :** Liquibase
- **Outils :** MapStruct, Lombok, Gradle

### Frontend
- **Framework :** React 19
- **Build Tool :** Vite 8
- **Langage :** TypeScript
- **I18n :** i18next
- **Style :** Vanilla CSS (Mobile-First)

## 📦 Installation & Lancement

### Avec Docker (Recommandé)

Le projet est entièrement conteneurisé. Pour lancer l'ensemble de l'application :

```bash
docker-compose up -d
```

L'application sera accessible sur :
- Frontend : [http://localhost](http://localhost)
- Backend : [http://localhost:8080](http://localhost:8080)
- Base de données : `localhost:3306`

### Développement Local

#### Backend
```bash
cd backend
./gradlew bootRunDev
```
*Note : Le profil `dev` utilise une base de données H2 en mémoire par défaut.*

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
L'application sera disponible sur [http://localhost:5173](http://localhost:5173) et proxifiera les appels API vers le port 8080.

## 🚢 Déploiement

Les images Docker sont disponibles sur Docker Hub :
- `gprime44/helper-backend:latest`
- `gprime44/helper-frontend:latest`

## 📊 Données

Les données d'inventaire proviennent du dataset [beerproto](https://github.com/beerproto/dataset) et sont automatiquement chargées en base de données au démarrage via Liquibase.

---
Développé avec ❤️ par la communauté Brassam.
