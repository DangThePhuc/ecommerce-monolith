const authService = require('../services/auth.service');

async function register(req, res) {
  const { username, fullname, password } = req.body || {};
  if (!username || !fullname || !password) {
    return res.status(400).json({ error: 'Thiếu username, fullname hoặc password' });
  }
  try {
    const user = await authService.register({ username, fullname, password });
    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  }
  try {
    const result = await authService.login({ username, password });
    res.json({ message: 'Đăng nhập thành công', ...result });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { register, login };