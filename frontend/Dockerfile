# Serveur Nginx pour les fichiers statiques
FROM nginx:alpine

# Copie des fichiers statiques pré-compilés
COPY dist /usr/share/nginx/html

# Configuration Nginx pour le routing SPA
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
