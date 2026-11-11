# 🎓 Plateforme de Gestion des Stagiaires (BIAT)

Application web complète pour la gestion et le suivi des stagiaires, candidatures, encadrants et sujets de stage.

---

## 🚀 Technologies Utilisées

### **Frontend**
- **Framework :** [Angular](https://angular.dev/) (v22+)
- **Langage :** TypeScript, HTML5, CSS3
- **Routing & Forms :** Angular Router & Reactive Forms
- **HTTP Client :** Communication REST avec le backend

### **Backend**
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** MySQL (`mysql2`)
- **Gestion des fichiers :** Multer (upload de CVs, rapports, etc.)
- **Sécurité & Config :** CORS, Dotenv

---

## 📁 Architecture du Projet

```text
gestion-stagiaires/
├── gestion-stagiaires/           # Application Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Composants (Header, Chat, Login, etc.)
│   │   │   ├── pages/            # Vues par rôle (Admin, RH, Encadrant, Stagiaire)
│   │   │   └── services/         # Services HTTP & Logique métier
│   │   └── assets/ & public/     # Images et styles globaux
│   ├── angular.json
│   └── package.json
│
├── gestion-stagiaires-backend/   # Serveur Backend (Node.js & Express)
│   ├── server.js                 # API REST & points de terminaison
│   ├── uploads/                  # Fichiers uploadés (CVs, documents)
│   ├── .env                      # Variables d'environnement (Base de données, Port)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 👥 Rôles & Fonctionnalités

- **Administrateur :** Supervision complète, gestion des utilisateurs et des comptes.
- **Ressources Humaines (RH) :**
  - Publication et gestion des offres de stage / sujets.
  - Traitement et validation des candidatures.
  - Affectation des stagiaires aux encadrants.
- **Encadrant :**
  - Suivi de l'avancement des stagiaires assignés.
  - Évaluation des tâches et des livrables.
  - Notifications et alertes.
- **Stagiaire :**
  - Consultation des sujets de stage et postulation.
  - Soumission des rapports d'avancement.
  - Communication et messagerie.

---

## ⚙️ Installation & Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/HamzaBenRomdhane1/gestion-stagiaires.git
cd gestion-stagiaires
```

---

### 2. Configuration & Démarrage du Backend

1. Accéder au dossier backend :
   ```bash
   cd gestion-stagiaires-backend
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer le fichier `.env` avec vos identifiants MySQL :
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=nom_de_votre_base
   ```
4. Lancer le serveur :
   ```bash
   node server.js
   ```

---

### 3. Démarrage du Frontend

1. Ouvrir un nouveau terminal et accéder au dossier frontend :
   ```bash
   cd gestion-stagiaires
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer l'application Angular :
   ```bash
   npm start
   # ou
   npx ng serve
   ```
4. Ouvrir votre navigateur sur [http://localhost:4200](http://localhost:4200).

---

## 👤 Auteur
- **Hamza Ben Romdhane** - [@HamzaBenRomdhane1](https://github.com/HamzaBenRomdhane1)
