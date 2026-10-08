const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function register({ username, fullname, password }) {
  const existed = await prisma.user.findUnique({ where: { username } });
  if (existed) throw createError('Username đã tồn tại', 409);

  const role = await prisma.role.findUnique({ where: { rolename: 'normal' } });
  if (!role) throw createError('Chưa có role normal, hãy chạy seed', 500);

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const membership = await tx.memberShip.create({
      data: { mname: 'normal', score: 10 },
    });
    return tx.user.create({
      data: {
        username,
        fullname,
        password: hashed,
        roleid: role.roleid,
        mid: membership.mid,
      },
      include: { role: true, membership: true },
    });
  });

  return {
    uid: user.uid,
    username: user.username,
    fullname: user.fullname,
    role: user.role.rolename,
    score: user.membership.score,
  };
}

async function login({ username, password }) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true, membership: true },
  });
  if (!user) throw createError('Sai username hoặc password', 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError('Sai username hoặc password', 401);

  const token = jwt.sign(
    { uid: user.uid, username: user.username, role: user.role.rolename },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    user: {
      uid: user.uid,
      username: user.username,
      fullname: user.fullname,
      role: user.role.rolename,
      score: user.membership.score,
    },
  };
}

module.exports = { register, login };