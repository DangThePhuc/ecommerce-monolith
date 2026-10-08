const orderService = require('../services/order.service');

async function create(req, res) {
  try {
    const order = await orderService.createOrder(req.user.uid, req.body && req.body.items);
    res.status(201).json({ message: 'Đặt hàng thành công', order });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getById(req, res) {
  const oid = Number(req.params.oid);
  if (!Number.isInteger(oid)) return res.status(400).json({ error: 'oid không hợp lệ' });
  try {
    const order = await orderService.getOrder(oid, req.user);
    res.json({ order });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getShipment(req, res) {
  const oid = Number(req.params.oid);
  if (!Number.isInteger(oid)) return res.status(400).json({ error: 'oid không hợp lệ' });
  try {
    const shipments = await orderService.getShipment(oid, req.user);
    res.json({ shipments });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { create, getById, getShipment };