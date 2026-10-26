const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

// All order routes require a valid JWT
router.use(verifyToken);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;

