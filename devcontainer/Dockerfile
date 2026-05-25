# La version de l'image DOIT correspondre à celle de @playwright/test dans package.json
FROM mcr.microsoft.com/playwright:v1.60.0-noble

# Empêche tout téléchargement de navigateurs lors du npm install
# Les navigateurs sont déjà inclus dans l'image Docker
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /workspace
