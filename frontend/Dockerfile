# --- Étape finale (Utilise le build local dans dist/) ---
FROM nginx:alpine

# On s'attend à ce que le dossier dist/ soit déjà généré par npm run build
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

# Correction des fins de ligne (CRLF -> LF) et permissions
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 80
