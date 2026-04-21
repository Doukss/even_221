# EVENT 221 API

API REST Express/Prisma pour la gestion du centre d'evenements EVENT 221.

## Lancement local

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

API : `http://localhost:3001`

Swagger : `http://localhost:3001/api-docs`

Alias Swagger : `http://localhost:3001/docs`

## Lancement avec Docker

```bash
docker compose up --build
```

## Endpoints principaux

- `GET /health`
- `GET|POST|DELETE /api/v1/clients`
- `GET|POST|DELETE /api/v1/espaces`
- `GET|POST|DELETE /api/v1/prestataires`
- `GET|POST /api/v1/reservations`

## Notes

- L'application utilise PostgreSQL via Prisma.
- Le conteneur applique les migrations Prisma avant de demarrer l'API.
- La documentation Swagger statique est servie directement par Express.
