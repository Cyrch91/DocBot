# Utiliser une image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /docbot

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --omit=dev \
    && npm install yarn \
    && npm install sequelize sequelize-cli mysql2

# Copier le reste du projet
COPY . .

# Définir la commande de démarrage
CMD ["node", "index.js"]