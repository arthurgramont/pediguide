# 🏥 Pediguide

> **Application de pré-diagnostic pédiatrique pour l'optimisation du parcours de soin.**

Pediguide est une solution full-stack conçue pour faciliter la gestion des parcours de pré-diagnostic en pédiatrie. Elle permet aux médecins de gérer leurs dossiers et propose un formulaire interactif par étapes pour établir un premier bilan.

L'application est déployée et accessible ici : [pediguide-frontend.vercel.app](https://pediguide-frontend.vercel.app)

---

## 🛠 Stack Technique

Le projet est conçu comme un **monorepo** séparant clairement le frontend et le backend.

### **Frontend** (`/frontend`)
- **Framework** : [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Langage** : TypeScript
- **State Management** : [Pinia](https://pinia.vuejs.org/)
- **UI & Styling** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn-vue](https://www.shadcn-vue.com/)
- **Validation** : Logique de validation personnalisée par étapes

### **Backend** (`/backend`)
- **Runtime** : Node.js (v20+)
- **Framework** : [Express](https://expressjs.com/)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
- **Authentification** : BCrypt & JWT (implémentation custom)

### **DevOps & Infra**
- **Conteneurisation** : Docker & Docker Compose
- **CI/CD** : GitHub Actions (Linting, Tests, Déploiement Vercel)
- **Hébergement** : Vercel (Frontend & Backend Serverless functions)

---

## ✨ Fonctionnalités Clés

- **Authentification Médecin** : Inscription et connexion sécurisée (RPPS, Email).
- **Parcours de Diagnostic** : Formulaire multi-étapes (5 étapes) avec validation progressive.
- **Logique conditionnelle** : Calculs automatiques (ex: âge max) et gestion des erreurs de saisie.
- **API REST** : Gestion des utilisateurs et réception des formulaires de diagnostic.

---

## 🚀 Installation et Démarrage (Local)

### Prérequis
- **Git**
- **Node.js** (v20 recommandé)
- **Docker Desktop** (pour la base de données locale)

### 1. Cloner le projet

```bash
git clone git@github.com:arthurgramont/pediguide.git
cd pediguide
```

### 2. Configuration des variables d'environnement

Vous devez créer un fichier `.env` dans les dossiers `backend` et `frontend` (ou utiliser les exemples fournis s'ils existent).

**Backend (`backend/.env`) :**
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/pediguide_db
```

**Frontend (`frontend/.env`) :**
```env
VITE_API_URL=http://localhost:3000
```

### 3. Démarrage via Docker Compose (Recommandé)

Cette méthode lance le backend, le frontend et une base de données PostgreSQL locale.

```bash
docker compose up --build
```
*L'application sera accessible sur `http://localhost:5173`.*

### 4. Démarrage Manuel (Sans Docker)

Si vous préférez lancer les services individuellement :

**Base de données :**
Assurez-vous d'avoir une instance PostgreSQL qui tourne et mettez à jour votre `DATABASE_URL`.

**Backend :**
```bash
cd backend
npm install
npm run migrate
npm run dev
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Base de données & Migrations

Le projet utilise **Drizzle ORM**. Les schémas sont définis dans `backend/src/db/schema.ts`.

Commandes utiles (à exécuter dans `/backend`) :
- `npm run generate` : Génère les fichiers SQL basés sur les changements de schéma.
- `npm run migrate` : Applique les changements à la base de données.
- `npm run push` : Synchronise directement le schéma (utile en dev rapide).

---

## ⚙️ CI/CD & Déploiement

Le projet dispose d'un pipeline d'intégration continue via **GitHub Actions** (fichier `.github/workflows/pipeline.yml`).

Le pipeline effectue les actions suivantes :
1. **Quality Check** : Linting (ESLint) et vérification des types pour le Backend et le Frontend.
2. **Déploiement** : 
  - Déclenchement automatique sur création de **Tag** (ex: `v1.0.0`).
  - Déploiement sur **Vercel** (Environnement de Production).
3. **Notification** : Envoi d'un rapport de déploiement sur Discord.

Pour déployer une nouvelle version en production :
```bash
git tag v1.0.X
git push origin v1.0.X
```

---

## 📂 Structure du Projet

```
.
├── .github/            # Workflows GitHub Actions
├── backend/            # API Node.js/Express
│   ├── drizzle/        # Migrations SQL
│   ├── src/
│   │   ├── db/         # Schémas et connexion DB
│   │   ├── routes/     # Routes API (Auth, Diagnosis)
│   │   └── app.ts      # Point d'entrée
│   └── Dockerfile
├── frontend/           # Application Vue 3
│   ├── src/
│   │   ├── components/ # Composants UI (Shadcn)
│   │   ├── pages/      # Vues (Login, Diagnosis, etc.)
│   │   ├── stores/     # Stores Pinia
│   │   └── router/     # Configuration des routes
│   └── Dockerfile
└── docker-compose.yml  # Orchestration locale
```