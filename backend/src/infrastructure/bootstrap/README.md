## Variables d'environnement requises

```env
# Base de données
DB_FILE_NAME=file:dev.sqlite

# Serveur
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001

# JWT (optionnel pour l'instant)
JWT_SECRET=dev-secret-key
```


## Flux de données

```
HTTP Request
    ↓
Express Router
    ↓
Controller (interface layer)
    ↓
Use Case (application layer) ← Injecté via Container
    ↓
Repository (infrastructure layer) ← Injecté via Container
    ↓
Database (Drizzle + SQLite)
    ↓
Repository → Use Case → Controller → Response
```

