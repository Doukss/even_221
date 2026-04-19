# EVENT 221 avec FastAPI

Le backend du projet tourne maintenant avec FastAPI tout en gardant les routes existantes sous `/api/v1`.

## Lancer avec Docker

```bash
docker compose up --build
```

API: `http://localhost:3001`

Documentation Swagger: `http://localhost:3001/docs`

Ancien alias de documentation: `http://localhost:3001/api-docs`

## Endpoints principaux

- `GET /health`
- `GET|POST|DELETE /api/v1/clients`
- `GET|POST|DELETE /api/v1/espaces`
- `GET|POST|DELETE /api/v1/prestataires`
- `GET|POST /api/v1/reservations`

## Notes

- La base PostgreSQL existante est réutilisée.
- Les règles métier de l'API Express ont été reproduites dans FastAPI.
