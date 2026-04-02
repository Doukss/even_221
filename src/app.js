const express      = require('express');
const morgan       = require('morgan');
const routes       = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
 
const app = express();
 
// ── Middlewares globaux ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
 
// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);
 
// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', app: 'EVENT 221 API' }));
 
// ── 404 catch-all ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' introuvable.` });
});
 
// ── Gestionnaire d'erreurs centralisé ──────────────────────────────────────
app.use(errorHandler);
 
module.exports = app;