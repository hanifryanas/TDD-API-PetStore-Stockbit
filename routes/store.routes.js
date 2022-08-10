const router = require('express').Router();
const StoreController = require('../controllers/store.controller.js');
const Middleware = require('../middleware/checkAuth.middleware.js');

router.get('/order/:id', Middleware.checkAuth, StoreController.getOrderById);
router.get('/inventory', StoreController.getStock);
router.post('/order', Middleware.checkAuth, StoreController.createNewOrder);
router.delete('/order/:id', Middleware.checkAuth, StoreController.deleteOrder);

module.exports = router;
