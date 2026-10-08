const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Thiếu token, vui lòng đăng nhập' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

module.exports = authenticate;