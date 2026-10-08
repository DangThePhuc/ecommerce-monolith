const prisma = require('../config/prisma');

async function list(req, res) {
  const products = await prisma.product.findMany({ orderBy: { pid: 'asc' } });
  res.json({ products });
}

module.exports = { list };