#!/bin/sh
# Remplacer le placeholder par la variable d'environnement réelle
sed -i "s|\${API_URL_PLACEHOLDER}|${VITE_API_URL}|g" /usr/share/nginx/html/index.html
nginx -g "daemon off;"
