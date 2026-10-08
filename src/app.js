const express = require('express');
const prisma = require('./config/prisma');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'E-commerce Monolithic API is running' });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Các route sẽ được gắn ở các bước sau:
// app.use('/auth', require('./routes/auth.routes'));
// app.use('/products', require('./routes/product.routes'));
// app.use('/orders', require('./routes/order.routes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;