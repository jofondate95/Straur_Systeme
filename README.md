# 🚌 STraur - Système de Gestion Intelligent de Transport Urbain

STraur est une plateforme digitale complète de gestion de transport intra-urbain composée d'une application mobile, une plateforme web d'administration, une API REST robuste, et un terminal de validation embarqué.

## 📱 Architecture Globale

```
STraur/
├── backend/                 # API REST NestJS + Prisma
├── mobile/                  # App React Native (Expo)
├── web-admin/               # Dashboard React.js
├── terminal-pwa/            # Terminal PWA de validation
├── docker-compose.yml       # Orchestration services
├── .env.example             # Variables d'environnement
└── README.md                # This file
```

## 🏗️ Stack Technique

### Backend
- **Framework** : NestJS + TypeScript
- **Database** : PostgreSQL (ORM Prisma)
- **Cache** : Redis
- **Auth** : JWT + Refresh Token
- **Real-time** : Socket.io
- **QR Code** : AES-256
- **Notifications** : Firebase Cloud Messaging (FCM)
- **Payment** : MTN MoMo + Orange Money APIs

### Mobile
- **Framework** : React Native (Expo)
- **Maps** : React Native Maps + Google Maps API
- **State** : Redux Toolkit
- **Storage** : AsyncStorage + SQLite

### Admin Web
- **Framework** : React.js
- **Styling** : TailwindCSS
- **Charts** : Recharts
- **Maps** : Google Maps API

### Terminal PWA
- **Framework** : React.js + PWA
- **Offline** : IndexedDB + Service Worker
- **QR Scanner** : jsQR / ZXing

## 🚀 Installation & Démarrage

### Prérequis
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 14+ (si local)
- Redis (si local)

### Option 1 : Docker Compose (Recommandé)

```bash
# Clone le repository
git clone https://github.com/jofondate95/Straur_Systeme.git
cd Straur_Systeme

# Copie le fichier .env
cp .env.example .env

# Lance tous les services
docker-compose up -d

# Initialise la base de données
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run seed
```

### Option 2 : Développement Local

#### Backend
```bash
cd backend
npm install

# Copie .env
cp .env.example .env

# Configure la database
npm run prisma:migrate
npm run seed

# Lance le serveur
npm run start:dev
# Serveur sur http://localhost:3000
```

#### Mobile
```bash
cd mobile
npm install

# Copie .env
cp .env.example .env

# Lance Expo
npm start
# Scanne le QR code avec Expo Go
```

#### Admin Web
```bash
cd web-admin
npm install

# Copie .env
cp .env.example .env

# Lance le dev server
npm start
# Sur http://localhost:3001
```

#### Terminal PWA
```bash
cd terminal-pwa
npm install

# Copie .env
cp .env.example .env

# Lance le dev server
npm start
# Sur http://localhost:3002
```

## 📚 Documentation API

La documentation Swagger est disponible à :
```
http://localhost:3000/api/docs
```

## 🔐 Variables d'Environnement

Voir `.env.example` pour la liste complète. Les variables critiques :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/straur
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Mobile Money
MTN_API_KEY=your-mtn-key
ORANGE_API_KEY=your-orange-key

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key

# Google Maps
GOOGLE_MAPS_API_KEY=your-api-key

# SMS (pour OTP)
SMS_PROVIDER_API_KEY=your-sms-key
```

## 🗄️ Modèle de Données

### Entités Principales
- **User** : Passagers, Conducteurs, Admins, Contrôleurs
- **Ligne** : Lignes de transport avec arrêts et horaires
- **Bus** : Véhicules avec position GPS temps réel
- **Réservation** : Trajets réservés par les passagers
- **Transaction** : Paiements Mobile Money
- **QrCode** : Codes QR chiffrés (valides 30 min)
- **Notification** : Alertes push FCM
- **Fidélité** : Points et trajets gratuits

## 🔑 Fonctionnalités Clés

### 📱 Mobile (Passagers)
- ✅ Authentification OTP SMS
- ✅ Carte temps réel des bus
- ✅ Réservation de trajet en 3 clics
- ✅ QR code animé (valide 30 min, offline)
- ✅ Paiement Mobile Money intégré
- ✅ Géolocalisation GPS du bus
- ✅ Historique trajets
- ✅ Points de fidélité + trajet gratuit
- ✅ Trajets favoris
- ✅ Partage de trajet avec proches
- ✅ Wallet avec recharge

### 🖥️ Admin Web
- ✅ Dashboard temps réel (bus, revenus, réservations)
- ✅ CRUD complet flotte de bus
- ✅ Gestion lignes, arrêts, horaires
- ✅ Liste utilisateurs (passagers, conducteurs, contrôleurs)
- ✅ Rapports financiers (revenus, transactions)
- ✅ Analyse flux (fréquentation, heures de pointe)
- ✅ Export PDF/CSV
- ✅ Carte géolocalisation temps réel

### 🚪 Terminal PWA (Contrôleurs)
- ✅ Scan QR code caméra
- ✅ Validation instantanée (< 1 sec)
- ✅ Détection doublons
- ✅ Mode offline avec sync différée
- ✅ Interface ultra-simple

## 🔐 Sécurité

- JWT tokens avec refresh automatique
- RBAC (Role-Based Access Control) strict
- Rate limiting sur endpoints publics
- Chiffrement AES-256 pour QR codes
- Validation des DTOs avec class-validator
- CORS configuré
- Logs structurés avec Winston
- Hachage bcrypt pour mots de passe

## 📊 Performance

- Cache Redis pour données fréquentes
- Pagination sur tous les endpoints
- Compression gzip
- Lazy loading sur mobile
- Indexation optimisée DB
- CDN pour assets statiques

## 🤝 Contribution

Pour contribuer :
1. Fork le projet
2. Crée une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

## 📝 License

MIT License - voir LICENSE.md pour les détails

## 📞 Support

Pour les questions ou problèmes :
- 📧 Email : support@straur.dev
- 💬 Issues GitHub : https://github.com/jofondate95/Straur_Systeme/issues
- 📱 WhatsApp : +243XXX

## 🎯 Feuille de Route

- [x] Architecture & setup
- [x] Backend API
- [x] Mobile app
- [x] Admin dashboard
- [x] Terminal PWA
- [ ] Tests e2e
- [ ] Performance optimization
- [ ] Scalability improvements
- [ ] Multi-langue support
- [ ] Analytics avancées

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-05-13  
**Statut** : 🟢 Production Ready
