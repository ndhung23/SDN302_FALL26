const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

// All product routes require a valid JWT
router.use(verifyToken);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

