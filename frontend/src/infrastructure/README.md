# Architecture API Frontend - Clean Avenir

## Vue d'ensemble

Ce dossier contient l'architecture complète de la couche API frontend, respectant les principes de Clean Architecture et les bonnes pratiques React.

## Structure du projet

```
frontend/src/
├── infrastructure/web/
│   ├── httpClient.ts          # Client HTTP centralisé avec gestion des erreurs
│   ├── endpoints.ts           # Définition de tous les endpoints API
│   ├── types.ts               # Types TypeScript basés sur les DTOs backend
│   ├── index.ts               # Export centralisé des services
│   └── services/
│       ├── authService.ts     # Service d'authentification
│       ├── accountService.ts  # Service de gestion des comptes
│       ├── savingService.ts   # Service de gestion de l'épargne
│       └── operationService.ts # Service de gestion des opérations
└── features/
    ├── index.ts               # Export centralisé des hooks
    ├── auth/
    │   ├── useLogin.ts        # Hook de connexion
    │   ├── useRegister.ts     # Hook d'inscription
    │   └── useAuth.ts         # Hook d'état d'authentification global
    ├── account/
    │   ├── useGetAccounts.ts  # Hooks de récupération des comptes
    │   └── useAccountDetails.ts # Hooks de détails et actions sur les comptes
    ├── savings/
    │   └── useGetSavings.ts   # Hooks de gestion de l'épargne
    └── operations/
        └── useGetRecentOperations.ts # Hooks de gestion des opérations
```

## Architecture

### Couche Infrastructure (`infrastructure/web/`)

**httpClient.ts**
- Client HTTP centralisé utilisant `fetch`
- Gestion automatique des tokens JWT (localStorage/sessionStorage)
- Intercepteurs pour les erreurs et l'authentification
- Types de retour standardisés avec `ApiResponse<T>`

**endpoints.ts**
- Centralisation de tous les endpoints API
- URLs dynamiques avec paramètres
- Types sécurisés pour éviter les erreurs de frappe

**types.ts**
- Types TypeScript synchronisés avec les DTOs backend
- Classes d'erreur personnalisées
- Interfaces pour les états async et mutations

**Services**
- Encapsulent la logique métier des appels API
- Mappage des erreurs backend vers des erreurs frontend typées
- Gestion des cas d'usage spécifiques

### Couche Features (`features/`)

**Hooks React**
- Respectent les règles React (pas de side effects dans le render)
- Utilisent `useEffect` pour tous les appels API
- État immuable avec `useState`
- Fonctions mémorisées avec `useCallback`
- Gestion complète des états : loading, error, success

## Bonnes pratiques implémentées

### Règles React respectées

**Pas de side effects dans le render**
- Tous les appels API sont dans `useEffect` ou des fonctions événementielles

**État immuable**
- Utilisation de `setState(prev => ({ ...prev, ... }))` partout

**Pas de props drilling**
- Hooks permettent l'accès direct aux données depuis n'importe quel composant

**Mémorisation appropriée**
- `useCallback` pour toutes les fonctions passées en dépendances

### Clean Architecture

**Séparation des couches**
- Infrastructure (HTTP/API) séparée de la logique métier (hooks)
- Types partagés entre les couches

**Inversion de dépendance**
- Les hooks dépendent des services, pas l'inverse
- Services testables indépendamment

**Single Responsibility**
- Chaque service/hook a une responsabilité unique et bien définie



## Configuration

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Types et erreurs

Le système de types est synchronisé avec le backend. Toute modification des DTOs backend nécessite une mise à jour des types frontend correspondants.

## Intégration avec les composants existants

Ces hooks peuvent être directement intégrés dans les composants dashboard existants :

- `DashboardAccountsOverview` → `useGetAccounts`
- `RecentOperations` → `useGetRecentOperations`
- `SavingsOverview` → `useGetSavings`, `useCurrentSavingRate`
- Formulaires d'auth → `useLogin`, `useRegister`

Remplacer simplement les données mockées par les hooks correspondants pour une intégration progressive.