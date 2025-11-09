# Roadmap — Projet Clean Avenir

## Contexte
Clean Avenir est une application bancaire moderne développée selon les principes de **Clean Architecture**, avec un **backend TypeScript (Express + Drizzle ORM)** et un **frontend Next.js 15 (React 19, Tailwind, Atomic Design)**.  
Le projet vise à offrir une solution modulaire, scalable et testable, tout en couvrant plusieurs aspects du monde bancaire : comptes, opérations, épargne, investissements, crédits, et gestion administrative.

---

## 1. État actuel du projet

### Backend — API Clean Architecture
- **Architecture :** Domain / Application / Infrastructure
- **Langage :** TypeScript
- **Framework :** Express
- **ORM :** Drizzle ORM (SQLite → PostgreSQL prévu)
- **Injection de dépendances :** Awilix
- **Tests :** Vitest + Supertest

#### Domain
- Entités : `User`, `Account`, `Operation`, `Saving`, `Investment`, `Action`, `Order`
- Value Objects : `Email`, `Money`, `IBAN`, `InterestRate`
- Services : `AuthService`, `InterestService`, `InvestmentService`

#### Application (Use Cases)
- Auth : `RegisterUseCase`, `LoginUseCase`
- Account : `CreateAccount`, `GetAccounts`, `GetAccountBalance`
- Operation : `Transfer`, `Deposit`, `Withdraw`, `GetOperations`
- Saving : `CreateSaving`, `GetSavings`
- Investment : `BuyAction`, `SellAction`, `GetPortfolio`

#### Infrastructure
- Repositories Drizzle pour chaque entité
- Routes Express :
  - `/api/auth` → Register, Login
  - `/api/accounts` → Création, liste, solde
  - `/api/operations` → Virement, dépôt, retrait, historique
  - `/api/savings` → Création, liste
  - `/api/investments` → Achat, vente, portefeuille
- Middlewares :
  - `authMiddleware` (JWT)
  - `errorHandler`
  - `validateRequest`
- Bootstrap :
  - `container.ts`, `devContainer.ts` (Awilix)
  - `server.ts` (initialisation serveur)

---

### Frontend — Next.js 15 + Tailwind
- **Structure :** Atomic Design (atoms, molecules, organisms, templates)
- **Langage :** TypeScript + React 19
- **Librairies :**
  - `react-hook-form` + `zod`
  - `axios` (client API)
  - `next-intl` (i18n)
  - `radix-ui` + `lucide-react` (UI)

#### Authentification
- Login / Register fonctionnels
- JWT stocké dans localStorage
- Redirection automatique vers `/dashboard`
- `AuthContext` + `useAuth()` global

#### Pages fonctionnelles
- `/login` → Connexion
- `/register` → Inscription
- `/dashboard` → Accueil utilisateur
- `/accounts` → Liste comptes
- `/accounts/create` → Création compte
- `/operations/transfer` → Virement
- `/dashboard` → Données partiellement dynamiques

#### Partiellement connectées
- `/operations` → Historique opérations (en cours)
- `/savings` → Épargnes (non finalisé)
- `/investments` → Portefeuille (non finalisé)

#### UI et i18n
- i18n complet (fr/en)
- Design responsive avec Tailwind
- SEO intégré (sitemap, robots, metadata)
- UX à améliorer (toasts, skeletons, erreurs API)

---

## 2. Ce qui reste à faire

### Phase 1 — Finalisation du socle existant
**Objectif :** Rendre 100% fonctionnelles les pages et routes déjà existantes.

#### Backend
- [ ] Ajouter Refresh token + Reset password
- [ ] Créer middleware `checkRole` pour rôles (CLIENT / CONSEILLER / DIRECTEUR)
- [ ] Automatiser calcul des intérêts (`node-cron`)
- [ ] Ajouter API mock prix actions
- [ ] Ajout pagination et rate limiting
- [ ] Tests unitaires sur tous les use cases

#### Frontend
- [ ] Finaliser pages :
  - `/accounts/[id]` (détail compte + historique)
  - `/operations` (historique complet)
  - `/savings` (liste et taux)
  - `/investments` (portefeuille et historique ordres)
- [ ] Connecter dashboard aux vraies données (soldes, dernières opérations)
- [ ] Ajouter toasts (succès/erreur)
- [ ] États de chargement (skeleton loaders)
- [ ] Middleware Next.js pour protection des routes
- [ ] Traductions manquantes

---

### Phase 2 — Nouvelles fonctionnalités : Crédit & Admin
**Objectif :** Étendre la logique métier et introduire la gestion administrative.

#### Backend
- [ ] Créer entité `Loan` (id, userId, amount, interestRate, duration, status)
- [ ] Use cases : `RequestLoan`, `SimulateLoan`, `RepayLoan`
- [ ] Routes `/api/loans`
- [ ] Gestion admin :
  - `/api/admin/clients`
  - `/api/admin/operations/pending`
  - `/api/admin/statistics`

#### Frontend
- [ ] Pages crédits :
  - `/loans/simulate`
  - `/loans/request`
  - `/loans`
- [ ] Pages admin :
  - `/admin/clients`
  - `/admin/statistics`
- [ ] Graphiques (chart.js ou recharts)
- [ ] Dashboard conseiller/directeur

---

### Phase 3 — Web Temps Réel (Socket.IO)
**Objectif :** Implémenter la messagerie instantanée et les notifications en temps réel.

#### Backend
- [ ] Installer `socket.io`
- [ ] Créer `infrastructure/realtime/` :
  - `WebSocketServer.ts`
  - `handlers/` (chat, notifications)
  - `services/` (MessageService, NotificationService)
- [ ] Entités : `Message`, `Conversation`, `Notification`
- [ ] Use cases :
  - `SendMessageUseCase`
  - `GetConversationsUseCase`
  - `CreateNotificationUseCase`
- [ ] Intégrer Socket.IO dans `server.ts`

#### Frontend
- [ ] Installer `socket.io-client`
- [ ] Créer `SocketContext.tsx`
- [ ] Composants :
  - `ChatBox`, `MessageList`, `MessageInput`
  - `NotificationDropdown`
- [ ] Pages :
  - `/messages` (chat global)
  - `/notifications` (historique)
- [ ] Temps réel :
  - Solde dynamique
  - Alertes opérations importantes

---

### Phase 4 — Sécurité, Tests, Production
**Objectif :** Préparer la mise en production stable et sécurisée.

#### Sécurité
- [ ] JWT en httpOnly cookies
- [ ] CSRF token
- [ ] Rate limiting sur routes sensibles
- [ ] Helmet + CORS renforcé

#### Tests & Monitoring
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Logs structurés (Winston/Pino)
- [ ] Monitoring erreurs (Sentry)
- [ ] CI/CD GitHub Actions

#### Production
- [ ] Migration vers PostgreSQL
- [ ] Documentation Swagger / OpenAPI
- [ ] Déploiement (Railway / Render / Vercel)
- [ ] Cache (Redis)
- [ ] Optimisation performance (pagination, lazy loading)

---

## 3. Vision long terme
Le projet Clean Avenir vise à devenir :
- Une **plateforme bancaire modulaire** respectant la Clean Architecture.
- Une **base pédagogique** solide pour apprentissage des concepts :
  - DDD (Domain-Driven Design)
  - CQRS / Use Cases
  - Injection de dépendances (IoC)
  - Web temps réel et événements métier
- Un **produit évolutif** :
  - Ajout futur d’une API mobile (React Native)
  - Dashboard analytique avancé
  - Automatisation de simulation financière

---

## 4. Plan de travail (suggestion d’équipe)

| Phase | Durée estimée | Responsable(s) | Objectif principal |
|-------|----------------|----------------|--------------------|
| 1️⃣ Finalisation Core | 2–3 semaines | Jérémy + Thibault | Front/Back 100% fonctionnel |
| 2️⃣ Crédit & Admin | 2 semaines | Thibault | Étendre logique métier |
| 3️⃣ Temps Réel | 3 semaines | Jérémy | Chat, notifications, WebSocket |
| 4️⃣ Production & CI/CD | 1–2 semaines | Tous | Déploiement stable & sécurisé |

---

## Résumé
- **Architecture :** Clean Architecture aboutie
- **Backend :** complet, modulaire, prêt pour extension
- **Frontend :** bien structuré, mais à finaliser
- **Prochaines étapes :**
  1. Finaliser intégration front ↔ back (Phase 1)
  2. Étendre logique métier (crédits, admin)
  3. Implémenter le temps réel
  4. Sécuriser et déployer

---

_Dernière mise à jour : 9 novembre 2025_
