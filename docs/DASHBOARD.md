# Tableau de Bord (Dashboard)

## 📝 Vue d'ensemble
Le tableau de bord est le hub central de l'utilisateur. Il doit fournir une vue immédiate sur ses activités récentes et faciliter l'accès aux fonctionnalités principales de création et de consultation.

## 🚀 Spécifications de la V1 (Live Data)

### 1. Accueil Personnalisé
- **Message :** "Bienvenue, {{username}} !"
- **Contexte :** Utilisation du `AuthContext` pour récupérer les informations de l'utilisateur connecté.

### 2. Recettes Récentes
- **Affichage :** Liste des 3 dernières recettes créées par l'utilisateur.
- **Détails par carte :** Nom, Style (via indicateur EBC), ABV estimé, IBU.
- **Action :** Clic sur une carte redirige vers le détail de la recette.
- **État vide :** Si aucune recette, afficher un message d'incitation avec un bouton "Nouvelle Recette".

### 3. Actions Rapides (CTA)
Boutons d'accès rapide sous forme de cartes descriptives :
- **"Nouvelle Recette" :** Redirige vers le créateur de recette.
- **"Explorer les Styles" :** Redirige vers le guide des styles (BJCP).

## 🎨 UI & UX
- **Layout :** Flexbox/Grid responsive (Mobile First).
- **Zéro Scroll Horizontal :** Conteneurs fluides avec gestion des débordements de texte (ellipsis).
- **Feedback :** État de chargement global pendant la récupération des données.
- **Thème :** Utilisation des variables d'accent (`--accent-bg`) pour les actions principales.

## ⏭️ Évolutions futures (v2)
- Statistiques de l'inventaire (Houblons, Malts, Levures).
- Calendrier des brassins à venir.
- Graphique de répartition des styles brassés.
