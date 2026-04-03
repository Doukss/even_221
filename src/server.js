require('dotenv').config();
 
const app    = require('./app');
const prisma = require('./config/database');
 
const PORT = process.env.PORT || 3001;
 
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅  Connexion PostgreSQL établie via Prisma.');
 
    app.listen(PORT, () => {
      console.log(`🚀  EVENT 221 API démarrée → http://localhost:${PORT}`);
      console.log(`📋  Environnement : ${process.env.NODE_ENV ?? 'development'}`);
    });
  } catch (error) {
    console.error('❌  Impossible de démarrer le serveur :', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
 
// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n🛑  Serveur arrêté proprement.');
  process.exit(0);
});
 
bootstrap();