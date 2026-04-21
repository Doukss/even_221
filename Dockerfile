FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev && npx prisma generate

COPY src ./src
COPY docs ./docs
COPY wait-for-db.sh ./

RUN chmod +x /app/wait-for-db.sh

EXPOSE 3001

CMD ["sh", "/app/wait-for-db.sh"]
