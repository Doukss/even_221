#!/bin/sh
set -e

echo "Attente de la base de donnees..."

until npx prisma migrate deploy; do
  echo "Base indisponible ou migrations en attente. Nouvelle tentative dans 3 secondes..."
  sleep 3
done

echo "Base prete. Demarrage de l'API..."

npm start
