const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const authenticate = require('../middlewares/auth');

router.use(authenticate); // mọi route đơn hàng đều cần token

router.post('/', orderController.create);
router.get('/:oid', orderController.getById);
router.get('/:oid/shipment', orderController.getShipment);

module.exports = router;