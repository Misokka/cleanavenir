# Backend — Drizzle / SQLite guide

Ce fichier explique comment utiliser Drizzle (drizzle-orm / drizzle-kit) localement pour ce projet.

Racine : `l:\clean\cleanavenir\backend`

## Pré-requis
- Node.js (version LTS recommandée)
- npm
- PowerShell (Windows)

## Installation (une seule fois)
Ouvrir PowerShell depuis le dossier `backend` :

```powershell
cd L:\clean\cleanavenir\backend
npm install
```

## Variables d'environnement
Créer un fichier `.env` à la racine de `backend` contenant :

```
DB_FILE_NAME=file:dev.sqlite
```

Le préfixe `file:` est requis pour la connexion SQLite utilisée par `drizzle-orm/libsql`.

## Commandes fréquentes

- Appliquer le schéma (push) — rapide pour le dev :

```powershell
npx drizzle-kit push
```

- Générer une migration à partir du schéma (optionnel, recommandé pour historique) :

```powershell
npx drizzle-kit generate
```

- Appliquer les migrations générées :

```powershell
npx drizzle-kit migrate
```

- Seed (exemples) :

```powershell
# seed users
npx tsx scripts/seed-users.ts

# seed bank accounts
npx tsx scripts/seed-accounts.ts
```

- Test rapide du repository user (script utilitaire) :

```powershell
npx tsx scripts/test-user-repo.ts
```

## Bonnes pratiques
- Ne pas importer `drizzle`/`db` dans la couche `domain` ou `application`. Les adaptateurs SQL restent dans `infrastructure`.
- Préférer l'injection du `db` dans les repositories (constructor injection) pour faciliter les tests.
- Pour les changements de schéma importants, utilisez `npx drizzle-kit generate` puis reviewez le SQL généré avant de committer.

## Dépannage rapide
- Erreur TypeScript `Cannot find module 'node:crypto'` :
  - Assurez‑vous d'avoir `@types/node` en `devDependencies` et d'avoir redémarré le TS server.
  - `backend/tsconfig.json` est configuré pour inclure `types: ["node"]` et inclut les dossiers `scripts`/`tests`.

- `better-sqlite3` problems on Windows :
  - Si vous préférez éviter la compilation native, on utilise `@libsql/client` (déjà installé). Sinon installez Visual Studio Build Tools.

## CI / Reset local DB
- Pour réinitialiser la DB locale (dev) :

```powershell
# supprimer la DB (facultatif)
Remove-Item .\dev.sqlite -ErrorAction SilentlyContinue

# reappliquer schema
npx drizzle-kit push

# reseed
npx tsx scripts/seed-users.ts
npx tsx scripts/seed-accounts.ts
```

## Points ouverts / TODOs
- Générer les migrations versionnées via `drizzle-kit generate` et commit.
- Ajouter schémas + repositories pour : savings, loans, stocks, orders, holdings, portfolio.
- Ajouter tests d'intégration Vitest (scénarios métier).

---

Si tu veux, je peux ajouter un exemple de job CI (GitHub Actions) qui applique les migrations puis lance les tests.
