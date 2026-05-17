# Authentification & Gestion Utilisateur

## 📝 Vue d'ensemble
L'application utilise une authentification basée sur les **JSON Web Tokens (JWT)** pour sécuriser les ressources et permettre une expérience personnalisée.

## 🚀 Spécifications Techniques (v1 - Authentification Locale)

### Backend
- **Framework :** Spring Security
- **Mécanisme :** JWT (Stateless)
- **Stockage Mots de passe :** BCrypt hashing
- **Contrainte :** Mot de passe de 8 caractères minimum.
- **Persistance :** Table `brassam_users` (SQLite)

### Endpoints API (`/api/auth`)
| Méthode | Endpoint | Description | Auth requise |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Création d'un nouveau compte | Non |
| `POST` | `/login` | Authentification et récupération du JWT | Non |

### Sécurité des ressources
- Toutes les APIs sous `/api/**` (sauf `/api/auth/**`) nécessitent un header `Authorization: Bearer <token>`.
- Les recettes (`Recipes`) sont filtrées par `user_id`. Un utilisateur ne peut accéder qu'à ses propres recettes.

## 🎨 Spécifications Frontend

### Composants requis
- **LoginView :** Formulaire d'authentification (email/password).
- **SignupView :** Formulaire de création de compte (username/email/password).
- **AuthProvider :** Context React pour gérer l'état `user`, le `token` et la persistance locale (localStorage).

### Flux d'authentification
1. L'utilisateur se connecte via `/login`.
2. Le backend renvoie un JWT et les infos utilisateur.
3. Le frontend stocke le JWT dans le `localStorage`.
4. Chaque requête API suivante inclut le token dans les headers : `Authorization: Bearer <token>`.
5. En cas de `401 Unauthorized`, l'utilisateur est déconnecté et redirigé vers le login.

## ⏭️ Évolutions futures (v2)
- Connexion via **Google OAuth2**.
- Réinitialisation de mot de passe par email.
- Gestion du profil utilisateur.

## 🗄️ Schéma de données (Utilisateurs)
```sql
CREATE TABLE brassam_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id VARCHAR(36) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```
