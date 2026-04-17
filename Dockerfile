FROM node:lts-alpine

WORKDIR /app

# Installer netcat (important pour wait-for-db)
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "wait-for-db.sh"]