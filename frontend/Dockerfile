FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Donner la propriété de tous les fichiers à notre utilisateur
RUN chown -R node:node /app

# Définition de l'utilisateur
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]