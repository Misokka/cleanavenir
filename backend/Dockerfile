FROM php:8.4-fpm-alpine

# Arguments pour l'utilisateur (pour éviter les problèmes de permissions)
ARG UID=1000
ARG GID=1000

# Installation des dépendances système et des extensions PHP nécessaires pour Symfony
RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    postgresql-dev # Pour la connexion à PostgreSQL

# Installation des extensions PHP
RUN docker-php-ext-install \
    intl \
    pdo pdo_pgsql \
    zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Création d'un utilisateur non-root
RUN addgroup -g ${GID} app_group && \
    adduser -u ${UID} -G app_group -s /bin/sh -D app_user

# Définition de l'utilisateur
USER app_user
EXPOSE 9000
# Définition du répertoire de travail
WORKDIR /var/www/html