const router = require('express').Router();
const PetController = require('../controllers/pet.controller.js');
const Middleware = require('../middleware/checkAuth.middleware.js');

router.get('/findByStatus', PetController.getPetByStatus);
router.get('/:id', PetController.getPetById);
router.post('/', Middleware.checkAuth, PetController.createNewPet);
router.post('/:id', Middleware.checkAuth, PetController.updateNameStatusPet);
router.post('/:id/uploadImage', Middleware.checkAuth, PetController.addImagePet);
router.put('/', Middleware.checkAuth, PetController.updatePet);
router.delete('/:id', Middleware.checkAuth, PetController.deletePet);

module.exports = router;