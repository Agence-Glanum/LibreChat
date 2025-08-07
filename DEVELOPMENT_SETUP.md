# 🚀 LibreChat - Configuration pour le Développement

Cette documentation explique comment configurer LibreChat pour le développement local avec **hot reload** (modifications visibles immédiatement).

## 📋 Prérequis

- Node.js 18+ et npm
- Docker et Docker Compose
- Git

## 🔧 Configuration Initiale

### 0. Installation de npm, nvm et Node.js v20.19.3 sur Debian

#### Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

#### Installation de npm (gestionnaire de paquets Node.js)
```bash
sudo apt install -y npm
```

#### Installation de nvm (Node Version Manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

#### Rechargement du profil bash
```bash
source ~/.bashrc
```

#### Installation de Node.js version 20.19.3
```bash
nvm install v20.19.3
```

#### Activation de Node.js v20.19.3
```bash
nvm use v20.19.3
```

#### Définition de la version par défaut
```bash
nvm alias default v20.19.3
```

#### Vérification de l'installation
```bash
node --version
npm --version
```

### 1. Fichiers à créer/modifier

#### A. Créer `docker-compose.dev.yml`

Créez ce fichier à la racine du projet :

```yaml
services:
  mongodb:
    ports:
      - "27017:27017"
  meilisearch:
    ports:
      - "7700:7700"
```

**Pourquoi ?** Ce fichier expose les ports des bases de données pour que npm puisse s'y connecter depuis l'hôte.

#### C. Vérifier le fichier `.env`

Assurez-vous que votre `.env` contient :

```env
MONGO_URI=mongodb://127.0.0.1:27017/LibreChat
```

### 2. Installation des dépendances

```bash
npm install
```

## 🚀 Démarrage du Projet

### Étape 1 : Lancer les bases de données (Docker)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d mongodb meilisearch
```

**Explication :**
- `-f docker-compose.yml` : Utilise la configuration principale
- `-f docker-compose.dev.yml` : Ajoute la configuration de développement (ports exposés)
- `up -d` : Lance en arrière-plan
- `mongodb meilisearch` : Lance seulement ces services (pas l'API)

### Étape 2 : Lancer le backend (npm)

```bash
npm run backend:dev
```

### Étape 3 : Lancer le frontend 

Dans un **nouveau terminal** :

```bash
npm run frontend:dev
```

## 🔍 Vérification

### Vérifier que les conteneurs fonctionnent

```bash
docker ps
```

Vous devriez voir :
```
CONTAINER ID   IMAGE                    PORTS
xxxxx          mongo                    0.0.0.0:27017->27017/tcp
xxxxx          getmeili/meilisearch     0.0.0.0:7700->7700/tcp
```


## 🔄 Workflow de Développement

1. **Modifier le code** dans `api/`, `client/`, ou `packages/`
2. **Sauvegarder** → Le serveur redémarre automatiquement (nodemon)
3. **Voir les changements** immédiatement dans le navigateur

---

**Note :** Cette configuration hybride (Docker pour DB + npm pour code) est recommandée par la documentation officielle LibreChat pour le développement.
