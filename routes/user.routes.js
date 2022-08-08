const router = require('express').Router();
const UserController = require('../controllers/user.controller.js');
const Middleware = require('../middleware/checkAuth.middleware.js');

router.get('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/:username', UserController.getUserByUsername);
router.post('/', UserController.createNewUser);
router.put('/:username', Middleware.checkAuth, UserController.updateUserByUsername);
router.delete('/:username', Middleware.checkAuth, UserController.deleteUserByUsername);

module.exports = router;