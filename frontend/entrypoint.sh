#!/bin/sh

# Remplacer la variable d'environnement dans le fichier JS généré ou via un script global
# Ici on injecte une variable globale window.ENV pour le frontend
echo "window.ENV = { API_URL: '${VITE_API_URL}' };" > /usr/share/nginx/html/env-config.js

# Lancer Nginx
exec nginx -g "daemon off;"
