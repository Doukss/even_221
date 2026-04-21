require('dotenv').config();

const app = require('./app');
const prisma = require('./config/database');

const PORT = Number(process.env.PORT || 3001);
const DB_MAX_RETRIES = Number(process.env.DB_MAX_RETRIES ?? 15);
const DB_RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS ?? 3000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry() {
  for (let attempt = 1; attempt <= DB_MAX_RETRIES; attempt += 1) {
    try {
      await prisma.$connect();
      console.log('Connexion PostgreSQL etablie via Prisma.');
      return;
    } catch (error) {
      if (attempt === DB_MAX_RETRIES) {
        throw error;
      }

      console.warn(
        `Connexion a la base impossible (tentative ${attempt}/${DB_MAX_RETRIES}). Nouvelle tentative dans ${DB_RETRY_DELAY_MS} ms...`
      );
      await wait(DB_RETRY_DELAY_MS);
    }
  }
}

async function bootstrap() {
  try {
    await connectWithRetry();

    app.listen(PORT, () => {
      console.log(`EVENT 221 API demarree -> http://localhost:${PORT}`);
      console.log(`Environnement : ${process.env.NODE_ENV ?? 'development'}`);
      console.log(`Swagger : http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Impossible de demarrer le serveur :', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\nServeur arrete proprement.');
  process.exit(0);
});

bootstrap();
