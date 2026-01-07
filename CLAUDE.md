# Clean Avenir — Project Context

<!--
Inventaire des fichiers/dossiers inspectés pour générer ce document:
- README.md (racine), ROADMAP.md
- backend/README.md, backend/DRIZZLE_SUMMARY.md, backend/package.json
- backend/src/domain/ (entities, value-objects, errors)
- backend/src/application/ (use-cases, ports/repositories, dtos)
- backend/src/infrastructure/ (drizzle schema, repositories, bootstrap/container)
- backend/src/interface/http-express/ (controllers, routes, middlewares)
- backend/src/shared/Result.ts
- backend/scripts/drizzleSeeds/ (seed scripts)
- frontend/src/app/[locale]/ (pages App Router)
- frontend/src/components/ (atoms, molecules, organisms, templates)
- frontend/src/infrastructure/web/ (services, httpClient, endpoints, types)
- frontend/src/features/ (hooks métier)
- frontend/src/locales/ (i18n fr/en)
- frontend/src/middleware.ts
-->

## TL;DR

**Backend**: Clean Architecture (Domain/Application/Infrastructure/Interface) + TypeScript + Express + Drizzle ORM (SQLite). DI avec Awilix. Pattern `Result<T, E>` partout.  
**Frontend**: Next.js 15 App Router + Atomic Design + TypeScript + Tailwind CSS + next-intl (fr/en).  
**Lancer**: `cd backend && npm run dev:express` (port 3000), `cd frontend && npm run dev` (port 3001).  
**DB**: SQLite (`dev.sqlite`), migrations Drizzle. Reset: `npm run db:reset` (Linux/macOS) ou `npm run db:reset:win` (Windows).  
**Rôles**: CLIENT, ADVISOR, DIRECTOR. Middleware `requireAuth` + `checkRole()` sur routes protégées.  
**Conventions money**: Montants en **centimes** (integer) en DB, taux prêt en **basis points** (350 = 3.5%), taux épargne en **micro-percentage** (2500000 = 2.5%). Diviser avant affichage.  
**Seeds**: Users avec mot de passe `Password123!` (john@example.com CLIENT, sophie@example.com ADVISOR, didier@example.com ADVISOR, pat@example.com DIRECTOR).  
**Ne pas**: Importer `db` dans domain/application, mettre logique métier dans controllers, utiliser `any`, oublier `Result<>` dans use cases.

---

## Repository Map

```
cleanavenir/
├── backend/
│   ├── src/
│   │   ├── domain/                    # Entités pures, Value Objects, Errors
│   │   ├── application/               # Use Cases + Ports (interfaces repositories/services)
│   │   ├── infrastructure/            # Implémentations (Drizzle repos, adapters, DI container)
│   │   ├── interface/http-express/    # Controllers, Routes, Middlewares HTTP
│   │   └── shared/                    # Utilitaires (Result, constants)
│   ├── scripts/drizzleSeeds/          # Scripts de seed DB
│   ├── drizzle/                       # Migrations SQL générées
│   ├── tests/                         # Tests Vitest
│   └── dev.sqlite                     # DB SQLite de développement
│
└── frontend/
    ├── src/
    │   ├── app/[locale]/              # Pages Next.js App Router (i18n)
    │   ├── components/                # Atomic Design (atoms/molecules/organisms/templates)
    │   ├── features/                  # Hooks métier React
    │   ├── infrastructure/web/        # Services API, httpClient, endpoints, types
    │   ├── contexts/                  # Contextes React (Auth, Toast, etc.)
    │   ├── locales/                   # Fichiers i18n (fr/, en/)
    │   └── middleware.ts              # Middleware Next.js (i18n routing)
    └── public/                        # Assets statiques
```

---

## Backend Architecture

### Couches Clean Architecture

1. **Domain** (`domain/`):
   - Entités métier pures: `User`, `Loan`, `BankAccount`, `Transaction`, `Stock`, `Order`, `Portfolio`, `Holding`, `SavingAccount`, `SavingProduct`
   - Value Objects: `Email`, `Money`, `IBAN`
   - Errors custom: `LoanNotFoundError`, `UserNotFoundError`, `BankAccountNotFoundError`, etc.
   - **Règle**: Aucune dépendance externe (ni DB, ni framework, ni infra)

2. **Application** (`application/`):
   - **Use Cases**: Actions métier (ex: `RequestLoanUseCase`, `ApproveLoanUseCase`, `TransferMoneyUseCase`, `PlaceOrderUseCase`)
   - **Ports**: Interfaces repositories (`LoanRepository`, `UserRepository`, etc.) et services (`OrderMatchingService`, `LoanCalculator`)
   - **DTOs**: Objets de transfert API (ex: `LoanDTO`, `UserDTO`)
   - **Règle**: Use cases retournent toujours `Result<T, Error>` (pas de `throw` dans la logique métier)

3. **Infrastructure** (`infrastructure/`):
   - **Repositories Drizzle**: Implémentations concrètes (ex: `LoanRepositoryDrizzle`, `UserRepositoryDrizzle`)
   - **Mappers**: Conversion DB ↔ Domain (ex: `DrizzleLoanMapper`, `DrizzleUserMapper`)
   - **Adapters**: Services externes (ex: `SimplePasswordHasher`, `BcryptPasswordHasher`)
   - **Bootstrap**: Container DI Awilix (`container.ts`)
   - **Schema DB**: Drizzle schema SQLite (`drizzle/schema.ts`)

4. **Interface** (`interface/http-express/`):
   - **Controllers**: Gestion HTTP (validation input, appel use case, format réponse JSON)
   - **Routes**: Définition endpoints REST (ex: `loan.routes.ts`, `account.routes.ts`)
   - **Middlewares**: `authMiddleware` (JWT), `roleMiddleware` (permissions), `errorMiddleware`
   - **Mappers DTO**: Conversion Entity → DTO pour API (ex: `toUserDTO`, `toLoanDTO`)

### Pattern Result<T, E>

**Fichier**: `backend/src/shared/Result.ts`

```typescript
export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });
```

**Usage dans Use Case**:

```typescript
async execute(input: Input): Promise<Result<Output, Error>> {
  const result = await this.repository.findById(input.id);
  if (!result.ok) {
    return err(new NotFoundError());
  }
  // Logique métier
  return ok(result.value);
}
```

**Usage dans Controller**:

```typescript
const result = await useCase.execute(input);
if (!result.ok) {
  return res.status(404).json({ error: result.error.message });
}
res.json({ data: result.value });
```

### Dependency Injection (Awilix)

**Container**: `backend/src/infrastructure/bootstrap/container.ts`

- Enregistre tous les repositories, use cases, services, mappers
- Injection par constructor
- Résolution automatique des dépendances

Exemple:

```typescript
container.register({
  loanRepository: asClass(LoanRepositoryDrizzle).singleton(),
  approveLoanUseCase: asClass(ApproveLoanUseCase).singleton(),
  // ...
});
```

### Routes principales

**Auth** (`/api/auth`):
- `POST /register` - Inscription
- `POST /login` - Connexion (JWT httpOnly cookie)
- `POST /logout` - Déconnexion
- `GET /me` - Infos user connecté

**Loans** (`/api/loans`):
- `POST /simulate` - Simuler prêt (CLIENT)
- `POST /request` - Demander prêt (CLIENT)
- `GET /` - Liste prêts user (CLIENT)
- `GET /:id` - Détail prêt (CLIENT)
- `GET /pending` - Prêts en attente (ADVISOR)
- `POST /:id/approve` - Approuver prêt (ADVISOR)
- `POST /:id/reject` - Rejeter prêt (ADVISOR)

**Accounts** (`/api/accounts`):
- `GET /` - Liste comptes user
- `GET /:id` - Détail compte
- `GET /:id/rib` - RIB (PDF)
- `PUT /:id/rename` - Renommer compte

**Savings** (`/api/savings`):
- `POST /` - Créer compte épargne
- `GET /` - Liste épargnes
- `GET /:id` - Détail épargne
- `POST /:id/transfer` - Virer de épargne → compte courant
- `POST /:id/deposit` - Déposer de compte courant → épargne

**Stocks/Orders** (`/api/stocks`, `/api/orders`):
- `GET /stocks` - Liste actions disponibles
- `GET /stocks/:id` - Détail action
- `POST /orders` - Passer ordre (BUY/SELL)
- `GET /orders` - Historique ordres
- `GET /portfolio` - Portfolio user

**Advisor** (`/api/loans/advisor`):
- `GET /clients` - Liste clients assignés
- `GET /client/:clientId/accounts` - Comptes d'un client
- `GET /client/:clientId/info` - Infos client

**Director** (`/api/admin`):
- `GET /clients` - Liste tous clients
- `DELETE /clients/:id` - Supprimer client (cascade)
- `GET /saving-products` - Liste produits épargne
- `POST /saving-products` - Créer produit épargne
- `PUT /saving-products/:id` - Modifier produit (taux)
- `GET /stocks` - Gestion actions
- `PUT /stocks/:id` - Modifier action (ticker, disponibilité)

**Middleware protections**:
- `requireAuth` sur toutes routes sauf `/auth/*`
- `checkRole(['ADVISOR', 'DIRECTOR'])` sur routes advisor/director
- `checkRole(['DIRECTOR'])` sur routes admin

---

## Frontend Architecture

### Structure Next.js App Router

**Pages** (`src/app/[locale]/`):

```
[locale]/
├── page.tsx                    # Landing page publique
├── login/page.tsx              # Connexion
├── register/page.tsx           # Inscription
├── client/dashboard/           # Dashboard CLIENT
│   ├── page.tsx                # Vue d'ensemble
│   ├── accounts/               # Comptes bancaires
│   │   └── [id]/page.tsx       # Détail compte
│   ├── savings/                # Épargne
│   │   ├── page.tsx            # Liste épargnes
│   │   └── [id]/page.tsx       # Détail épargne
│   ├── loans/                  # Prêts
│   │   ├── page.tsx            # Liste prêts
│   │   ├── [id]/page.tsx       # Détail prêt
│   │   ├── request/page.tsx    # Demander prêt
│   │   └── simulate/page.tsx   # Simuler prêt
│   ├── stocks/                 # Investissements
│   │   ├── page.tsx            # Marché actions
│   │   ├── [id]/page.tsx       # Détail action
│   │   └── portfolio/page.tsx  # Mon portfolio
│   └── operations/page.tsx     # Historique transactions
├── advisor/                    # Dashboard ADVISOR
│   ├── dashboard/page.tsx      # Vue d'ensemble
│   ├── loans/page.tsx          # Prêts en attente (approve/reject)
│   └── clients/page.tsx        # Liste clients assignés
└── director/                   # Dashboard DIRECTOR
    ├── dashboard/page.tsx      # Vue d'ensemble
    ├── clients/page.tsx        # Gestion clients
    ├── savings/page.tsx        # Gestion produits épargne
    └── stocks/                 # Gestion actions
        ├── page.tsx            # Liste actions
        └── [id]/edit/page.tsx  # Modifier action
```

**Convention**:
- Pages serveur par défaut (Server Components)
- `'use client'` en haut pour Client Components (hooks React, événements, state)

### Atomic Design

**Atoms** (`components/atoms/`):
- `Button.tsx` - Boutons (variants: primary, secondary, outline, destructive)
- `Typography.tsx` - Textes (variants: h1, h2, h3, body, caption)
- `Card.tsx` - Cartes conteneur
- `Input.tsx` - Champs de formulaire
- `Badge.tsx` - Badges de statut

**Molecules** (`components/molecules/`):
- `ApprovalModal.tsx` - Modal approbation prêt (advisor)
- `RenameAccountModal.tsx` - Modal renommer compte
- `CreateSavingModal.tsx` - Modal créer épargne
- `DepositToSavingModal.tsx` - Modal dépôt épargne
- `TransferFromSavingModal.tsx` - Modal retrait épargne
- `RateChangeNotificationModal.tsx` - Modal notification changement taux

**Organisms** (`components/organisms/`):
- `Header.tsx` - En-tête global
- `Footer.tsx` - Pied de page
- `LoanRequestForm.tsx` - Formulaire demande prêt
- `LoanSimulator.tsx` - Simulateur prêt
- `AccountsOverview.tsx` - Vue d'ensemble comptes
- `SavingsOverview.tsx` - Vue d'ensemble épargnes
- `LoansList.tsx` - Liste prêts

**Templates** (`components/templates/`):
- `DashboardLayout.tsx` - Layout dashboards (sidebar, header, navigation selon rôle)

**Règle**: Réutiliser les composants existants. Toujours typer les props avec TypeScript.

### Services API

**Location**: `infrastructure/web/services/`

Services disponibles:
- `authService.ts` - login, register, logout, getCurrentUser
- `accountService.ts` - getAccounts, getAccountById, renameAccount, getRIB
- `advisorService.ts` - getPendingLoans, approveLoan, rejectLoan, getClientAccounts, getClientInfo
- `loanService.ts` - requestLoan, simulateLoan, getUserLoans, getLoanById
- `savingService.ts` - createSaving, getSavings, getSavingById, transferFromSaving, depositToSaving
- `stocksService.ts` - getStocks, getStockById, placeOrder, getOrders, getPortfolio
- `adminService.ts` - getClients, deleteClient, getSavingProducts, createSavingProduct, updateSavingProduct

**HTTP Client**: `infrastructure/web/httpClient.ts`
- Wrapper fetch avec gestion JWT (cookies httpOnly automatiques depuis backend)
- Headers `Content-Type: application/json` automatiques
- Gestion erreurs HTTP (`HttpClientError`)
- Base URL: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:3000/api`)

**Endpoints**: `infrastructure/web/endpoints.ts`
- Constantes endpoints API (ex: `API_ENDPOINTS.AUTH.LOGIN`, `API_ENDPOINTS.LOANS.REQUEST`)

**Types**: `infrastructure/web/types.ts`
- DTOs frontend (ex: `UserDTO`, `LoanDTO`, `AccountDTO`)
- Interfaces requêtes/réponses

### Hooks React

**Location**: `features/`

Hooks métier organisés par domaine:
- `auth/` - useLogin, useLogout, useAuth, useRegister
- `account/` - useGetAccounts, useRenameAccount
- `loans/` - useRequestLoan, useSimulateLoan, useGetLoans
- `savings/` - useGetSavings, useCreateSaving
- `admin/` - useGetClients, useDeleteClient

**Convention**:
- Hooks appellent services dans `useEffect` ou event handlers
- État géré avec `useState`, fonctions mémorisées avec `useCallback`
- Pas de side effects dans le render (toujours `useEffect`)

### Gestion Auth

**Auth Context**: `contexts/AuthProvider.tsx`
- Fournit user connecté (`user`, `role`, `isLoading`)
- Hook `useAuth()` pour accès global

**Flow**:
1. Login → `authService.login()` → JWT stocké en cookie httpOnly (backend)
2. Requêtes API → `httpClient` envoie cookie automatiquement
3. Backend vérifie JWT via `authMiddleware`
4. Frontend récupère user via `GET /auth/me` au mount de `AuthProvider`

**Protection routes**:
- Middleware Next.js (`middleware.ts`) redirige vers `/login` si non authentifié (à configurer selon besoins)
- Côté backend: `requireAuth` + `checkRole()` protègent les endpoints

---

## Business Rules (Observed)

### Rôles et Permissions

**CLIENT**:
- Peut demander prêts (`POST /loans/request`)
- Voir ses comptes/prêts/épargnes/portfolio
- Faire virements entre comptes
- Passer ordres boursiers (BUY/SELL)
- Créer comptes épargne

**ADVISOR**:
- Approuver/rejeter prêts en attente (`POST /loans/:id/approve`, `/loans/:id/reject`)
- Voir clients assignés (après approbation d'un prêt)
- Accéder aux comptes/infos des clients assignés
- **Ne peut pas** modifier les données clients directement

**DIRECTOR**:
- Tous droits ADVISOR
- Gérer clients (liste complète, suppression cascade)
- Gérer produits épargne (CRUD)
- Gérer actions (modifier ticker, disponibilité, **pas le prix** après création)
- Accès admin complet

### Règle Prêt → Advisor Assignment

**Observé dans**: `ApproveLoanUseCase.ts`

1. Client demande prêt → statut `PENDING`, `advisorIdentifier` vide ou pré-assigné
2. Advisor approuve prêt:
   - Prêt passe à statut `ACTIVE`
   - `advisorIdentifier` du prêt = ID advisor qui approuve
   - Client est assigné à cet advisor (`client.advisorIdentifier = advisorId`)
   - Compte bancaire client est crédité du montant prêt (transaction `LOAN_DISBURSEMENT`)
   - Date prochaine mensualité = mois suivant
3. Advisor peut désormais voir ce client dans sa liste clients

**Règle clé**: Premier advisor à approuver devient propriétaire du client.

### Règle Accès Advisor → Client

**Observé dans**: `getClientInfoController.ts`

Advisor peut accéder aux infos d'un client si:
1. Client lui est assigné (`client.advisorIdentifier === advisorId`), **OU**
2. Client a un prêt `PENDING` (accès temporaire pour approval)

Une fois prêt approuvé/rejeté par un autre advisor, l'accès temporaire est perdu.

### Règle Prix Actions

**Observé dans**: `director/stocks/[id]/edit/page.tsx`

- Director peut créer action avec prix initial
- Après création, le prix est géré par le marché (ordres buy/sell)
- Director ne peut **pas** modifier manuellement le prix (champ lecture seule en édition)
- Director peut modifier: `ticker`, `isAvailable` (disponibilité au trading)

### Règle Compte SYSTEM

**Observé dans**: `seed-users.ts`, `listClientsController.ts`

- Compte spécial: `sys@example.com`, role `CLIENT`, firstname/lastname = `SYSTEM`
- Utilisé pour portfolio de la banque (ordres système)
- **Filtré** de la liste clients director (ne doit pas être supprimé/modifié)
- Identifiable par `firstname === 'SYSTEM' && lastname === 'SYSTEM'`

---

## Data & Money Conventions

### Montants monétaires

**DB**: Stocké en **centimes** (integer, type `INTEGER` SQLite)
- Exemple: 25 000 € = 2 500 000 (centimes)
- Évite problèmes arrondis float

**API/DTO**: Transmis en centimes (cohérence backend ↔ frontend)

**Affichage frontend**: Diviser par 100 et formatter

```typescript
// Exemple frontend
const formatCurrency = (amountInCents: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInCents / 100);
};

// Exemple: 250000 centimes → "2 500,00 €"
```

**Conversion backend → frontend**:
- Mappers DTO peuvent convertir centimes → euros avant envoi API (convention à vérifier selon endpoint)
- Certains endpoints envoient centimes, d'autres euros (voir DTO)

### Taux d'intérêt

**Prêts (Loans)**: Stocké en **basis points** (integer)
- Exemple: 3.5% = 350 (basis points)
- Formule calcul: `rate / 10000` pour obtenir décimal
- Observé dans `LoanCalculator.ts`:

```typescript
const MONTHLY_INTEREST_RATE = (annualInterestRate / 10000 / 12);
// 350 basis points → 0.035 / 12 = 0.00291666 (taux mensuel)
```

**Épargne (Savings)**: Stocké en **micro-percentage** (integer)
- Exemple: 2.5% = 2 500 000 (micro-percentage)
- Formule: `rate / 1000000` pour obtenir pourcentage
- Observé dans `DrizzleSavingProductMapper.ts`:

```typescript
toDomain(raw: SavingProductDrizzle): SavingProduct {
  return SavingProduct.create({
    rate: raw.rate / 1000000, // 2500000 → 2.5%
  });
}
```

**Affichage**: Diviser par 100 (ou 10000/1000000 selon contexte) + formatter avec `.toFixed(2)`

### Dates

**Format**: ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- Exemple: `"2026-01-07T10:30:00.000Z"`

**Nullable**: `null` ou `undefined` pour dates optionnelles
- Exemple: `lastPaidAt`, `nextToPayAt` sur prêts `PENDING` = `null`

**Stockage DB**: SQLite `TEXT` type (pas de type date natif)

**Conversion**:
- Backend: `new Date().toISOString()` pour génération
- Frontend: `new Date(isoString)` pour parsing

---

## DB / Drizzle

### Commandes essentielles

**Push schema** (dev rapide, pas de migration):

```bash
npx drizzle-kit push
```

**Générer migration SQL** (prod recommandé):

```bash
npx drizzle-kit generate
```

**Appliquer migrations**:

```bash
npx drizzle-kit migrate
```

**Studio Drizzle** (UI web pour explorer DB):

```bash
npm run db:studio
```

### Reset DB + Seeds

**Windows**:

```powershell
npm run db:reset:win
```

**Linux/macOS**:

```bash
npm run db:reset
```

**Détail commande** (Windows):
1. Supprime `dev.sqlite` si existe
2. Crée nouveau `dev.sqlite` vide
3. Applique migrations (`npx drizzle-kit migrate`)
4. Exécute seeds (`npm run db:seed:all:drizzle`)

### Seeds disponibles

**Location**: `backend/scripts/drizzleSeeds/`

Ordre d'exécution (via `db:seed:all:drizzle`):
1. `seed-users.ts` - Crée 5 users:
   - `john@example.com` - CLIENT
   - `sophie@example.com` - ADVISOR
   - `didier@example.com` - ADVISOR
   - `pat@example.com` - DIRECTOR
   - `sys@example.com` - CLIENT (SYSTEM account)

2. `seed-advisors.ts` - Crée profils advisors (sophie, didier)

3. `seed-clients.ts` - Crée profils clients (john, sys)

4. `seed-savingProducts.ts` - Crée produits épargne (Livret A, PEL, etc.)

5. `seed-accounts.ts` - Crée comptes bancaires pour clients

6. `seed-companies-stocks.ts` - Crée entreprises + actions

7. `seed-system-stocks-holdings.ts` - Crée portfolio banque (SYSTEM)

**Mot de passe par défaut**: `Password123!`
- En dev, hasher simple: stocké comme `plain:Password123!`
- Connexion avec `Password123!` en clair

### Emplacement DB

**Dev**: `backend/dev.sqlite`
- Défini dans `.env`: `DB_FILE_NAME=file:dev.sqlite`
- Préfixe `file:` requis pour `drizzle-orm/libsql`

**Tests**: DB temporaires par test
- Voir `backend/tests/helpers/createTestDb.ts`

### Schema

**Fichier**: `backend/src/infrastructure/drizzle/schema.ts`

**Tables principales**:

```typescript
// Users & Profiles
users (id, email, password, role, firstname, lastname, ...)
clients (id, userId, advisorId, ...)
advisors (id, userId, ...)
directors (id, userId, ...)

// Banking
bank_accounts (id, ownerId, name, iban, balance, ...)
transactions (id, accountId, amount, type, direction, ...)

// Loans
loans (id, clientId, advisorId, amount, status, rate, ...)

// Savings
saving_accounts (id, ownerId, productId, balance, ...)
saving_products (id, label, rate, rateUpdatedAt, ...)

// Investments
stocks (id, companyId, ticker, price, isAvailable, ...)
companies (id, name, ...)
orders (id, ownerId, stockId, type, status, quantity, ...)
portfolios (id, ownerId, totalValue, ...)
holdings (id, portfolioId, stockId, quantity, ...)

// Communication
discussions (id, clientId, advisorId, ...)
messages (id, discussionId, senderId, content, ...)
```

**Relations**: Définies avec `relations()` de Drizzle pour queries relationnelles.

---

## i18n (next-intl)

### Structure

**Location**: `frontend/src/locales/`

```
locales/
├── fr/
│   ├── common.json
│   └── admin.json
└── en/
    ├── common.json
    └── admin.json
```

**Namespaces organisés par domaine** (à confirmer selon structure réelle):
- `common` - Textes globaux (navigation, boutons génériques)
- `auth` - Connexion, inscription
- `dashboard` - Dashboards
- `loans` - Prêts
- `accounts` - Comptes bancaires
- `admin` - Administration

### Ajouter une clé

1. **Ajouter dans FR** (`locales/fr/common.json`):

```json
{
  "buttons": {
    "approve": "Approuver",
    "reject": "Rejeter"
  }
}
```

2. **Ajouter traduction EN** (`locales/en/common.json`):

```json
{
  "buttons": {
    "approve": "Approve",
    "reject": "Reject"
  }
}
```

3. **Utiliser dans composant**:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <button>{t('buttons.approve')}</button>
  );
}
```

### Piège connu

**Symptôme**: Clé affichée en brut (`common.buttons.approve`) au lieu du texte.

**Cause**: Clé existe en FR mais **pas en EN** (ou vice-versa).

**Solution**: Toujours synchroniser FR et EN. Vérifier que chaque clé existe dans les 2 langues.

### Middleware i18n

**Fichier**: `frontend/src/middleware.ts`

- Locales supportées: `['fr', 'en']`
- Locale par défaut: `'fr'`
- Routes matchées: `/`, `/(fr|en)/:path*`
- Redirige vers `/fr/...` si locale absente

**URLs**:
- Français: `http://localhost:3001/fr/client/dashboard`
- Anglais: `http://localhost:3001/en/client/dashboard`

---

## Testing / Validation

### Tests backend

**Framework**: Vitest

**Location**: `backend/tests/`

**Exemples**:
- `user-repo.test.ts` - Tests repository users
- `stock-repo.test.ts` - Tests repository stocks
- `RegisterUseCase.test.ts` - Tests use case inscription

**Lancer tests**:

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Helper DB test**: `backend/tests/helpers/createTestDb.ts`
- Crée DB SQLite temporaire par test
- Applique schema
- Nettoie après test

### CI/CD

**GitHub Actions**: `.github/workflows/ci-drizzle.yml`
- Run sur push/PR
- Exécute: `drizzle-kit push` + `npm test`

### Checks manuels importants

**1. Login**:
- Tester avec `john@example.com` / `Password123!` (CLIENT)
- Tester avec `sophie@example.com` / `Password123!` (ADVISOR)
- Tester avec `pat@example.com` / `Password123!` (DIRECTOR)
- Vérifier redirection dashboard selon rôle

**2. Loan Approval Flow**:
- Créer prêt en tant que CLIENT (`/client/dashboard/loans/request`)
- Se connecter en ADVISOR
- Approuver prêt (`/advisor/loans`)
- Vérifier:
  - Prêt passe à `ACTIVE`
  - Compte client crédité du montant
  - Client apparaît dans liste clients advisor
  - Advisor assigné sur le prêt

**3. Advisor Access Control**:
- Vérifier qu'advisor voit uniquement ses clients assignés
- Tester accès temporaire prêt `PENDING` (advisor peut voir pour approval)
- Après rejet/approval par autre advisor, vérifier perte d'accès

**4. Stock Trading**:
- Placer ordre BUY en tant que CLIENT
- Placer ordre SELL compatible (même stock, prix croisé)
- Vérifier matching automatique (statut `FILLED`, trades créés)
- Vérifier portfolio mis à jour (holdings + cash)

**5. Savings**:
- Créer compte épargne
- Vérifier débit compte source
- Tester dépôt supplémentaire
- Tester retrait (transfert vers compte courant)

**6. Director Actions**:
- Supprimer client → vérifier cascade (orders, portfolio, loans, savings, transactions, accounts supprimés)
- Modifier taux produit épargne → vérifier notification client au login
- Modifier action (ticker, disponibilité OK, **pas prix**)

**7. i18n**:
- Changer locale (`/fr` ↔ `/en`)
- Vérifier traductions complètes (pas de clés en brut)
- Tester navigation sidebar, formulaires, toasts

**8. RIB Generation** (à confirmer fonctionnalité):
- Télécharger RIB compte (`GET /accounts/:id/rib`)
- Vérifier PDF généré avec bonnes infos

---

## Coding Conventions

### DTOs & Mappers

**DTOs** (`application/dtos/`):
- Objets plats pour API (ex: `LoanDTO`, `UserDTO`)
- **Pas de méthodes**, seulement data
- Sérializables JSON

**Mappers** (`infrastructure/repositories/mappers/`):
- **Drizzle Mappers**: DB row ↔ Domain Entity (ex: `DrizzleLoanMapper`)
  - `toDomain(raw: LoanDrizzle): Loan`
  - `toPersistence(entity: Loan): NewLoanDrizzle`
  
- **DTO Mappers**: Domain Entity ↔ DTO API (ex: `toLoanDTO`)
  - Location: `interface/http-express/mappers/dtoMappers.ts`
  - `toLoanDTO(loan: Loan): LoanDTO`

**Règle**: Mappers isolés dans `infrastructure/` et `interface/`. Pas dans `domain/` ou `application/`.

### Repositories

**Interface** (`application/ports/repositories/`):

```typescript
export interface LoanRepository {
  save(loan: Loan): Promise<Result<Loan, Error>>;
  findById(id: string): Promise<Result<Loan, LoanNotFoundError>>;
  update(loan: Loan): Promise<Result<Loan, Error>>;
  delete(id: string): Promise<Result<boolean, Error>>;
  findAllByUserId(userId: string): Promise<Result<Loan[], Error>>;
}
```

**Implémentation** (`infrastructure/repositories/drizzle/`):

```typescript
export class LoanRepositoryDrizzle implements LoanRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly mapper: DrizzleLoanMapper
  ) {}

  async findById(id: string): Promise<Result<Loan, LoanNotFoundError>> {
    const rows = await this.db.select().from(loans).where(eq(loans.id, id));
    if (rows.length === 0) {
      return err(new LoanNotFoundError(id));
    }
    return ok(this.mapper.toDomain(rows[0]));
  }
  
  // ...
}
```

**Règle**: Méthodes retournent `Result<T, Error>`. Jamais de `throw` dans repositories.

### Use Cases

**Location**: `application/use-cases/`

**Structure**:

```typescript
export interface InputDTO {
  // Input params
}

export class MyUseCase {
  constructor(
    private readonly repository: Repository,
    private readonly service: Service
  ) {}

  async execute(input: InputDTO): Promise<Result<OutputDTO, Error>> {
    // 1. Validation input
    // 2. Récupération données (repositories)
    // 3. Logique métier
    // 4. Sauvegarde résultat
    // 5. Retour Result
  }
}
```

**Règles**:
- **Un use case = une action métier** (ex: `ApproveLoanUseCase`, `TransferMoneyUseCase`)
- Méthode `execute(input): Promise<Result<Output, Error>>`
- **Pas de dépendances** vers controllers ou DB directement (injection via ports)
- **Pas de `throw`** - toujours `return err(...)` pour erreurs métier

### Controllers

**Location**: `interface/http-express/controllers/`

**Pattern standard**:

```typescript
export const myController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // 1. Extraire params/body
    const { param1, param2 } = req.body;
    
    // 2. Validation basique (format, required)
    if (!param1) {
      return res.status(400).json({ error: 'param1 required' });
    }
    
    // 3. Appeler use case
    const useCase = req.container.resolve<MyUseCase>('myUseCase');
    const result = await useCase.execute({ param1, param2 });
    
    // 4. Gérer résultat
    if (!result.ok) {
      // Map error type → HTTP status
      if (result.error instanceof NotFoundError) {
        return res.status(404).json({ error: result.error.message });
      }
      return res.status(400).json({ error: result.error.message });
    }
    
    // 5. Retourner réponse succès
    return res.status(200).json({ data: result.value });
    
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

**Règles**:
- **Rôle**: Valider input HTTP, appeler use case, formatter réponse
- **Pas de logique métier** (doit rester dans use cases)
- Résoudre use case via container DI (`req.container.resolve`)
- Mapper type erreur → code HTTP approprié

### TypeScript Best Practices

**Typage strict**:
- ❌ Jamais `any` (sauf cas extrême justifié)
- ✅ Utiliser `unknown` si type inconnu, puis narrow avec type guards
- ✅ Typer props React, params fonctions, retours

**Result pattern**:
- ✅ Toujours gérer erreurs explicitement (pas de `throw` dans use cases/repos)
- ✅ Check `result.ok` avant accès `result.value`

**Props React**:

```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onAction: () => void;
}

export function MyComponent({ title, count, onAction }: MyComponentProps) {
  // ...
}
```

### Nommage

**Backend**:
- **Entities**: PascalCase (`User`, `Loan`, `BankAccount`)
- **Use Cases**: Verbe + Nom + `UseCase` (`ApproveLoanUseCase`, `RequestLoanUseCase`)
- **Controllers**: Action + `Controller` (`approveLoanController`, `loginController`)
- **Repositories**: Nom + `Repository` + implémentation (`LoanRepository`, `LoanRepositoryDrizzle`)
- **Routes**: Verbe HTTP + path REST (`POST /loans/:id/approve`)

**Frontend**:
- **Components**: PascalCase (`ApprovalModal`, `DashboardLayout`)
- **Hooks**: `use` + Action (`useLogin`, `useGetAccounts`)
- **Services**: Nom + `Service` (`authService`, `loanService`)
- **Fichiers pages**: lowercase avec tirets ou kebab-case Next.js (`[id]/page.tsx`)

### Ce qu'il ne faut PAS introduire

❌ **`any` en TypeScript** (sauf cas extrême documenté)  
❌ **Logique métier dans controllers** (doit rester dans use cases)  
❌ **Import `db` ou Drizzle dans `domain/` ou `application/`** (violation architecture)  
❌ **Side effects dans render React** (toujours `useEffect` ou event handlers)  
❌ **`throw` dans use cases/repositories** (utiliser `Result<T, E>`)  
❌ **Clés i18n non traduites** (vérifier FR + EN)  
❌ **Modifications directes state React** (toujours `setState`)  
❌ **Queries SQL raw dans use cases** (passer par repositories)  

---

## Scripts utiles

### Backend

```bash
# Dev
npm run dev:express         # Lance serveur Express (port 3000)
npm run build               # Compile TypeScript → dist/
npm run start:express       # Lance serveur compilé (prod)

# DB
npm run migrate:push        # Push schema (dev rapide)
npm run migrate:generate    # Générer migration SQL
npm run migrate:up          # Appliquer migrations
npm run db:reset            # Reset DB + seeds (Linux/macOS)
npm run db:reset:win        # Reset DB + seeds (Windows)
npm run db:studio           # UI Drizzle Studio

# Seeds individuels
npm run db:seed:users:drizzle
npm run db:seed:advisors:drizzle
npm run db:seed:clients:drizzle
npm run db:seed:savingProducts:drizzle
npm run db:seed:accounts:drizzle
npm run db:seed:companies-stocks:drizzle
npm run db:seed:system-stocks-holdings:drizzle
npm run db:seed:all:drizzle  # Tous les seeds

# Tests
npm test                    # Run tests Vitest
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report

# Qualité code
npm run lint                # ESLint check
npm run lint:fix            # ESLint auto-fix
npm run format              # Prettier format
npm run typecheck           # TypeScript check sans build
```

### Frontend

```bash
# Dev
npm run dev                 # Lance Next.js dev (port 3001)
npm run build               # Build production
npm run start               # Lance build prod

# Qualité code
npm run lint                # Next.js lint
npm run typecheck           # TypeScript check (si configuré)
```

---

## Environnement & Configuration

### Backend `.env`

**Requis**:

```env
DB_FILE_NAME=file:dev.sqlite
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Optionnel**:

```env
PORT=3000
BCRYPT_ROUNDS=10
```

**Note sécurité**: En dev, `SimplePasswordHasher` est utilisé (pas de vrai hash). En prod, utiliser `BcryptPasswordHasher` et générer un `JWT_SECRET` fort.

### Frontend `.env.local`

**Requis**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Troubleshooting

### Backend

**Erreur**: `Cannot find module 'node:crypto'`
- **Cause**: `@types/node` manquant ou version Node.js incompatible
- **Solution**: `npm install --save-dev @types/node` + redémarrer TS server

**Erreur**: `FOREIGN KEY constraint failed`
- **Cause**: Suppression entité avec relations non gérées
- **Solution**: Supprimer dans ordre inverse dépendances (Orders → Portfolio → Loans → Savings → Transactions → Accounts → Client → User)

**Erreur**: `SQLITE_BUSY: database is locked`
- **Cause**: Plusieurs processus accèdent DB simultanément
- **Solution**: Fermer autres connexions (Drizzle Studio, autres serveurs), redémarrer

**Erreur**: `Password hasher not registered`
- **Cause**: Container DI non initialisé ou hasher non enregistré
- **Solution**: Vérifier `container.ts` enregistre `SimplePasswordHasher` ou `BcryptPasswordHasher`

### Frontend

**Erreur**: `Hydration mismatch`
- **Cause**: Différence rendu serveur vs client (dates, random, localStorage dans render)
- **Solution**: Utiliser `useEffect` pour code client-only, `suppressHydrationWarning` si nécessaire

**Erreur**: `Invalid hook call`
- **Cause**: Hook appelé conditionnellement ou dans mauvais contexte
- **Solution**: Hooks toujours au top-level du composant, pas dans conditions/boucles

**Erreur**: Clé i18n affichée en brut (`common.buttons.approve`)
- **Cause**: Clé manquante dans fichier locale actuel (FR ou EN)
- **Solution**: Ajouter clé dans les 2 langues (FR et EN)

**Erreur**: `401 Unauthorized` sur toutes requêtes API
- **Cause**: Cookie JWT expiré ou manquant
- **Solution**: Se reconnecter, vérifier cookie `authToken` dans DevTools → Application → Cookies

---

## Resources

**Documentation**:
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Next.js App Router](https://nextjs.org/docs/app)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Awilix DI](https://github.com/jeffijoe/awilix)

**Fichiers projet**:
- [`README.md`](README.md) (racine) - Setup général
- [`ROADMAP.md`](ROADMAP.md) - Fonctionnalités à venir
- [`backend/README.md`](backend/README.md) - Guide Drizzle/SQLite détaillé
- [`backend/DRIZZLE_SUMMARY.md`](backend/DRIZZLE_SUMMARY.md) - Résumé migrations
- [`frontend/src/infrastructure/README.md`](frontend/src/infrastructure/README.md) - Architecture services frontend (si existe)

---

**Dernière mise à jour**: 7 janvier 2026  
**Version projet**: En développement actif  
**Contributeurs**: Voir git log

---

## Quick Start (TL;DR x2)

```bash
# 1. Clone repo
git clone <repo-url>
cd cleanavenir

# 2. Backend
cd backend
npm install
cp .env.example .env  # Ajuster variables
npm run db:reset:win  # ou db:reset (Linux/macOS)
npm run dev:express   # Port 3000

# 3. Frontend (nouveau terminal)
cd ../frontend
npm install
npm run dev           # Port 3001

# 4. Login
# URL: http://localhost:3001/fr/login
# User: john@example.com / Password123! (CLIENT)
# User: sophie@example.com / Password123! (ADVISOR)
# User: pat@example.com / Password123! (DIRECTOR)
```

**Bon code!** 🚀
