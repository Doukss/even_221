#!/bin/sh
echo "⏳ Attente de la base de données..."

while ! nc -z db 5432; do
  sleep 1
done

echo "✅ Base de données prête !"

npm start

