const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Route thử token, dùng để demo middleware JWT
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;