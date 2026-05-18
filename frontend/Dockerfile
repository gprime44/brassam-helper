# --- Étape de build ---
FROM node:22-alpine AS build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste des fichiers et build
COPY . .
RUN npm run build

# --- Étape finale (Nginx) ---
FROM nginx:alpine

# Copie du build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

# Correction des fins de ligne et permissions
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 80
