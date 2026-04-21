const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const docsDir = path.join(__dirname, '..', 'docs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(docsDir, 'swagger-ui.html'));
});

app.get('/api-docs/swagger.json', (req, res) => {
  res.sendFile(path.join(docsDir, 'swagger.json'));
});

app.get('/docs', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/v1', routes);

app.get('/health', (req, res) => res.json({ status: 'OK', app: 'EVENT 221 API' }));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' introuvable.` });
});

app.use(errorHandler);

module.exports = app;
