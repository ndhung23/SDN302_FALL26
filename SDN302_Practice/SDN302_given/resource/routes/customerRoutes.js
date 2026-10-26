const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');

router.use(verifyToken);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);

module.exports = router;

