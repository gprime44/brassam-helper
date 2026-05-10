# Étape 1 : Build
FROM node:22-alpine AS build
WORKDIR /app

# Copie des fichiers de package et installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build
COPY . .
RUN npm run build

# Étape 2 : Run (Serveur Nginx pour les fichiers statiques)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx personnalisée pour le routing SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
