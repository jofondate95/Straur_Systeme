# 🚌 STraur - Système de Gestion Intelligent de Transport Urbain

## 📌 Vue d'ensemble

STraur est une solution digitale complète pour la gestion intelligente du transport urbain intra-municipal. Elle comprend une application mobile pour les passagers, une plateforme web d'administration, une API backend robuste et un terminal de validation embarqué pour les contrôleurs.

### 🎯 Objectifs
- Simplifier la réservation et le paiement des trajets urbains
- Offrir un suivi temps réel des bus
- Générer des rapports financiers détaillés
- Fidéliser les passagers avec un système de points
- Garantir la validation sécurisée via QR codes chiffrés

---

## 🏗️ Architecture Générale

```
Straur_Systeme/
├── backend/              # API NestJS
├── mobile/               # App React Native (Expo)
├── web-admin/            # Dashboard React.js
├── terminal-pwa/         # PWA Scanner QR
├── docker-compose.yml    # Orchestration Docker
└── README.md            # Ce fichier
```

---

## 🛠️ Stack Technique

### Backend
- **Framework** : NestJS + TypeScript
- **Base de données** : PostgreSQL 15 + Prisma ORM
- **Cache** : Redis 7
- **Temps réel** : Socket.io
- **Authentification** : JWT + Refresh Tokens
- **SMS** : Twilio
- **QR Code** : AES-256 chiffrement
- **Notifications** : Firebase Cloud Messaging
- **Paiement** : MTN MoMo + Orange Money

### Mobile
- **Framework** : React Native avec Expo
- **Navigation** : React Navigation
- **Cartographie** : React Native Maps
- **State Management** : Redux ou Context API
- **HTTP Client** : Axios

### Web Admin
- **Framework** : React.js 18
- **UI** : TailwindCSS
- **Graphiques** : Recharts
- **État** : Redux Toolkit
- **Cartes** : Google Maps React

### Terminal PWA
- **Framework** : React.js
- **Scan QR** : html5-qrcode
- **Offline** : Service Workers + IndexedDB
- **Synchronisation** : Background Sync API

---

## 📋 Modèle de Données

### Entités Principales

#### User
```typescript
- id: UUID
- nom: string
- prénom: string
- téléphone: string (unique)
- email: string (unique)
- motDePasse: string (hashed)
- rôle: PASSAGER | CONDUCTEUR | ADMIN | CONTROLEUR
- walletSolde: decimal
- pointsFidelite: integer
- createdAt: timestamp
```

#### Ligne
```typescript
- id: UUID
- nom: string
- description: string
- couleur: string (hex)
- statut: ACTIVE | INACTIVE
```

#### Arrêt
```typescript
- id: UUID
- nom: string
- latitude: decimal
- longitude: decimal
- ligneId: UUID (FK)
```

#### Bus
```typescript
- id: UUID
- immatriculation: string (unique)
- ligneId: UUID (FK)
- conducteurId: UUID (FK)
- statut: EN_SERVICE | HORS_SERVICE | EN_PAUSE
- latitudeActuelle: decimal
- longitudeActuelle: decimal
- updatedAt: timestamp
```

#### Réservation
```typescript
- id: UUID
- userId: UUID (FK)
- ligneId: UUID (FK)
- arrêtMonteeId: UUID (FK)
- arrêtDescenteId: UUID (FK)
- horaireId: UUID (FK)
- dateTrajet: date
- statut: EN_ATTENTE | CONFIRMÉE | VALIDÉE | ANNULÉE
- montant: decimal
- qrCodeToken: string (AES-256)
- qrCodeExpireAt: timestamp
- createdAt: timestamp
```

#### Transaction
```typescript
- id: UUID
- userId: UUID (FK)
- réservationId: UUID (FK)
- montant: decimal
- type: PAIEMENT | REMBOURSEMENT | BONUS_FIDELITE
- statut: EN_ATTENTE | RÉUSSIE | ÉCHOUÉE
- opérateur: MTN | ORANGE
- référence: string
- createdAt: timestamp
```

#### TrajetFavori
```typescript
- id: UUID
- userId: UUID (FK)
- ligneId: UUID (FK)
- arrêtMonteeId: UUID (FK)
- arrêtDescenteId: UUID (FK)
- libellé: string ("Maison → Travail")
```

#### PartageTrajet
```typescript
- id: UUID
- réservationId: UUID (FK)
- userId: UUID (FK) // propriétaire
- bénéficiaireId: UUID (FK)
- statut: PENDING | ACCEPTED | REJECTED
```

#### Notification
```typescript
- id: UUID
- userId: UUID (FK)
- titre: string
- message: string
- type: INFO | ALERT | PROMOTION
- lu: boolean
- createdAt: timestamp
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** 18+
- **npm** ou **yarn**
- **Docker** et **Docker Compose**
- **Git**

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/jofondate95/Straur_Systeme.git
cd Straur_Systeme
```

### 2️⃣ Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs réelles
```

### 3️⃣ Lancer Docker Compose

```bash
npm run docker:up
```

Cela démarre :
- PostgreSQL
- Redis
- Backend NestJS

### 4️⃣ Initialiser la base de données

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
```

### 5️⃣ Lancer l'application mobile (optionnel)

```bash
cd mobile
npm install
npm start
# Scannez le QR code avec Expo Go
```

### 6️⃣ Lancer le dashboard admin (optionnel)

```bash
cd web-admin
npm install
npm start
# Accédez à http://localhost:3000
```

---

## 📚 Documentation des Modules Backend

### AuthModule
Gestion de l'authentification, inscription, login, refresh tokens et OTP SMS.

**Endpoints** :
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/verify-otp` - Vérification OTP
- `POST /auth/refresh` - Renouvellement token
- `POST /auth/logout` - Déconnexion

### UsersModule
Gestion complète des utilisateurs, rôles, wallet et fidélité.

**Endpoints** :
- `GET /users/:id` - Profil utilisateur
- `PUT /users/:id` - Mise à jour profil
- `GET /users/:id/wallet` - Solde wallet
- `GET /users/:id/fidelity-points` - Points fidélité

### LignesModule
Gestion des lignes de bus, arrêts et horaires.

**Endpoints** :
- `GET /lignes` - Liste des lignes
- `POST /lignes` - Créer une ligne (Admin)
- `PUT /lignes/:id` - Modifier une ligne (Admin)
- `DELETE /lignes/:id` - Supprimer une ligne (Admin)
- `GET /lignes/:id/arrets` - Arrêts d'une ligne
- `GET /lignes/:id/horaires` - Horaires d'une ligne

### BusModule
Gestion de la flotte, affectation conducteurs et position GPS.

**Endpoints** :
- `GET /buses` - Liste des bus (Admin)
- `POST /buses` - Ajouter un bus (Admin)
- `PUT /buses/:id` - Modifier bus (Admin)
- `GET /buses/:id/location` - Position GPS en temps réel
- `PUT /buses/:id/status` - Changer statut

### ReservationsModule
Création de réservations, gestion paiements et QR codes.

**Endpoints** :
- `POST /reservations` - Créer réservation
- `GET /reservations/:id` - Détail réservation
- `GET /reservations` - Mes réservations
- `PUT /reservations/:id/cancel` - Annuler réservation
- `POST /reservations/:id/pay` - Paiement
- `GET /reservations/:id/qr-code` - Obtenir QR code

### QrCodeModule
Génération, chiffrement AES-256 et vérification QR codes.

**Endpoints** :
- `POST /qr-codes/generate` - Générer QR code
- `POST /qr-codes/verify` - Vérifier QR code
- `POST /qr-codes/validate` - Valider (terminal)

### PaymentModule
Intégration Mobile Money (MTN MoMo, Orange Money).

**Endpoints** :
- `POST /payments/mtn-momo` - Paiement MTN MoMo
- `POST /payments/orange-money` - Paiement Orange Money
- `POST /payments/webhook` - Webhook paiement
- `GET /payments/:id/status` - Statut paiement

### NotificationsModule
Gestion push FCM et notifications in-app.

**Endpoints** :
- `POST /notifications/send` - Envoyer notification (Admin)
- `GET /notifications` - Mes notifications
- `PUT /notifications/:id/read` - Marquer comme lu

### FideliteModule
Calcul points, bonus et déclenchement trajets gratuits.

**Endpoints** :
- `GET /fidelity/points` - Mes points
- `GET /fidelity/rewards` - Récompenses disponibles
- `POST /fidelity/redeem` - Utiliser récompense

### FavorisModule
Gestion trajets favoris et réservation rapide.

**Endpoints** :
- `POST /favoris` - Ajouter favori
- `GET /favoris` - Mes favoris
- `DELETE /favoris/:id` - Supprimer favori
- `POST /favoris/:id/quick-reserve` - Réserver trajet favori

### PartageModule
Partage de réservations avec proches.

**Endpoints** :
- `POST /partages` - Créer partage
- `GET /partages` - Mes partages
- `PUT /partages/:id/accept` - Accepter partage
- `PUT /partages/:id/reject` - Refuser partage

### StatsModule
Agrégation données, rapports et exports.

**Endpoints** :
- `GET /stats/dashboard` - Vue d'ensemble
- `GET /stats/revenue` - Revenus (Admin)
- `GET /stats/usage` - Utilisation lignes
- `GET /stats/export/csv` - Export CSV
- `GET /stats/export/pdf` - Export PDF

### SocketGateway
Géolocalisation temps réel et événements Socket.io.

**Events** :
- `bus:location:update` - Position bus mise à jour
- `reservation:confirmed` - Réservation confirmée
- `bus:arriving` - Bus arrivant (5 min)

---

## 🔐 Sécurité

### JWT Authentication
- Access Token : 15 minutes
- Refresh Token : 7 jours
- Stockage sécurisé (HttpOnly cookies côté mobile)

### QR Code
- Chiffrement AES-256
- Validité : 30 minutes
- Contenu : userId, réservationId, ligneId, timestamp, signature HMAC
- Fonctionnement offline sur terminaux validateurs

### Rate Limiting
- 100 requêtes par minute par IP
- Endpoints d'authentification : 5 requêtes par 15 min

### Validation
- Class-validator pour tous les DTOs
- Sanitization entrées utilisateur
- CORS restrictif

---

## 📱 Application Mobile - Écrans Principaux

1. **Onboarding** : 3 slides d'introduction
2. **Authentification** : Login, signup avec OTP
3. **Accueil** : Carte temps réel, recherche trajet
4. **Réservation** : Sélection ligne → arrêts → horaire → paiement
5. **Détail Réservation** : QR code, localisation bus
6. **Historique** : Trajets effectués
7. **Favoris** : Trajets sauvegardés
8. **Fidélité** : Points et récompenses
9. **Wallet** : Solde, rechargement, transactions
10. **Profil** : Infos utilisateur

---

## 💻 Dashboard Admin - Sections

1. **Dashboard** : KPIs temps réel, graphes
2. **Flotte** : CRUD bus, statuts
3. **Lignes & Arrêts** : Gestion réseau
4. **Utilisateurs** : CRUD, gestion rôles
5. **Finances** : Revenus, transactions
6. **Statistiques** : Analyses avancées
7. **Paramètres** : Configuration système

---

## 📱 Terminal PWA - Validation QR

- Interface minimaliste
- Scan caméra ultra-rapide (< 1 sec)
- Mode offline avec sync
- Feedback visuel clair (✅ ❌ ⚠️)
- Logs validation pour audits

---

## 🐳 Déploiement Docker

### Lancer tout le système
```bash
npm run docker:up
```

### Voir les logs
```bash
npm run docker:logs
```

### Arrêter
```bash
npm run docker:down
```

---

## 📞 Support & Contribution

Pour toute question ou contribution :
- 📧 Email : team@straur.com
- 🐛 Issues : https://github.com/jofondate95/Straur_Systeme/issues
- 📚 Docs : https://docs.straur.com

---

## 📄 Licence

MIT © 2026 STraur Team

---

**Dernière mise à jour** : 2026-05-13
