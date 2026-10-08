const prisma = require('../config/prisma');

function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function createOrder(uid, items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createError('Đơn hàng phải có ít nhất 1 sản phẩm', 400);
  }

  const pids = items.map((i) => Number(i.pid));
  if (new Set(pids).size !== pids.length) {
    throw createError('Mỗi sản phẩm chỉ xuất hiện một lần trong đơn', 400);
  }
  for (const i of items) {
    if (!Number.isInteger(Number(i.pid)) || !Number.isInteger(Number(i.qty)) || Number(i.qty) <= 0) {
      throw createError('pid và qty phải là số nguyên, qty > 0', 400);
    }
  }

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { pid: { in: pids } } });
    if (products.length !== pids.length) {
      throw createError('Có sản phẩm không tồn tại', 404);
    }

    // Trừ tồn kho, chỉ trừ được khi còn đủ hàng
    for (const item of items) {
      const result = await tx.product.updateMany({
        where: { pid: Number(item.pid), quantity: { gte: Number(item.qty) } },
        data: { quantity: { decrement: Number(item.qty) } },
      });
      if (result.count === 0) {
        throw createError(`Sản phẩm ${item.pid} không đủ hàng`, 400);
      }
    }

    // Tạo đơn, chi tiết đơn và shipment
    const order = await tx.order.create({
      data: {
        uid,
        createat: new Date(),
        details: {
          create: items.map((item) => {
            const p = products.find((x) => x.pid === Number(item.pid));
            return {
              pid: p.pid,
              qty: Number(item.qty),
              unit_price: p.price,
            };
          }),
        },
        shipments: { create: { status: 'pending' } },
      },
      include: {
        details: { include: { product: true } },
        shipments: true,
      },
    });

    return order;
  });
}

async function getOrder(oid, user) {
  const order = await prisma.order.findUnique({
    where: { oid },
    include: { details: { include: { product: true } }, shipments: true },
  });
  if (!order) throw createError('Không tìm thấy đơn hàng', 404);
  if (order.uid !== user.uid && user.role !== 'admin') {
    throw createError('Bạn không có quyền xem đơn này', 403);
  }
  return order;
}

async function getShipment(oid, user) {
  const order = await getOrder(oid, user);
  return order.shipments;
}

module.exports = { createOrder, getOrder, getShipment };