require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};