# cleanavenir

# COMMENT LANCER LE PROJET 

## Pour drizzle (FORTEMENT RECOMMANDÉ)

dans ./backend 

cp .env.example .env

npm install

npx drizzle-kit push

npm run db:seed:all:drizzle

npm run dev:express

dans ./frontend

cp .env.example .env

npm install

npm run dev

## seed

pour connaitre les command allez dans le package.json du backend.

le mot de passe par défaut pour les utilisateurs seedés est
password
les utilisateurs


alice@example.com client 
bob@example.com client
tom@example.com conseiller
didier@example.com conseiller
pat@example.com directeur


dans ./backend

npx drizzle-kit push

npm run db:seed:all:drizzle

## Pour Prisma (Backend incomplet)

À la racine du projet dans un .env: 
- Ajouter `DATABASE_URL="postgresql://[username]:[password]@db:[port]/[database_name]"`

dans le .env de backend et backend/src/interface/http-nest
`NEST_PORT=2999`
`DATABASE_URL_PRISMA="postgresql://[username]:[password]@db:[port]/[database_name]"`

### Pour la bdd

- `docker compose up -d`
- Dans backend npx prisma generate puis npx prisma migrate dev
- Lancer les seeds avec npm run db:seed:users:prisma

### Pour tester le backend prisma + postgres:

Aller sur la route `http://localhost:[port]/users/role/[ROLE]` ROLE === "CLIENT" | "ADVISOR" | "DIRECTOR"

## Tests Prisma

Les tests Prisma nécessitent une base de données PostgreSQL de test.

### Option 1 : Avec Docker (recommandé)

```bash
# 1. Démarrer un conteneur PostgreSQL de test
docker run --name postgres-test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=cleanavenir_test -p 5433:5432 -d postgres

# 2. Définir l'URL de la base de test
export DATABASE_URL_TEST="postgresql://postgres:test@localhost:5433/cleanavenir_test"

# 3. Synchroniser le schéma Prisma
cd backend
DATABASE_URL=$DATABASE_URL_TEST npx prisma db push --schema=src/infrastructure/repositories/prisma/schema.prisma

# 4. Lancer les tests Prisma
npm test -- prisma-stock-repo.test.ts prisma-beneficiary-repo.test.ts
```

### Option 2 : Avec une base PostgreSQL existante

```bash
# 1. Créer une base de données de test
psql -U postgres -c "CREATE DATABASE cleanavenir_test;"

# 2. Définir l'URL de la base de test
export DATABASE_URL_TEST="postgresql://postgres:votre_mot_de_passe@localhost:5432/cleanavenir_test"

# 3. Synchroniser le schéma et lancer les tests
cd backend
DATABASE_URL=$DATABASE_URL_TEST npx prisma db push --schema=src/infrastructure/repositories/prisma/schema.prisma
npm test -- prisma-stock-repo.test.ts prisma-beneficiary-repo.test.ts
```

### Lancer tous les tests

```bash
cd backend
npm test
```