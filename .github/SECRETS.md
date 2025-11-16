# Configuration GitHub Actions - Secrets à configurer

Pour que les workflows CI/CD fonctionnent correctement, vous devez configurer les secrets suivants dans les paramètres du repository GitHub :

## Secrets pour le Deployment Backend

- `SSH_PRIVATE_KEY` : Clé SSH privée pour se connecter au serveur
- `REMOTE_HOST` : Adresse du serveur de production (ex: `server.cleanavenir.com`)
- `REMOTE_USER` : Utilisateur SSH (ex: `deploy`)
- `BACKEND_TARGET_PATH` : Chemin de destination sur le serveur (ex: `/var/www/cleanavenir/backend`)

## Secrets pour le Deployment Frontend (Vercel)

- `VERCEL_TOKEN` : Token d'authentification Vercel
- `VERCEL_ORG_ID` : ID de l'organisation Vercel
- `VERCEL_PROJECT_ID` : ID du projet Vercel
- `NEXT_PUBLIC_API_URL` : URL de l'API en production (ex: `https://api.cleanavenir.com`)

## Comment configurer les secrets

1. Aller dans `Settings` > `Secrets and variables` > `Actions`
2. Cliquer sur `New repository secret`
3. Ajouter chaque secret avec sa valeur

## Environments

Pour utiliser les environments de protection, créer un environment nommé `production` dans :
`Settings` > `Environments` > `New environment`

Vous pouvez y ajouter des règles de protection comme :
- Required reviewers (approbation manuelle)
- Wait timer (délai avant déploiement)
- Deployment branches (limiter aux branches main)
