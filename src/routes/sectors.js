const express = require('express');
const router = express.Router();
const sectorsController = require('../controllers/sectors');

router.get('/curso-js-sector/sectores', sectorsController.getAllSector);
router.get('/curso-js-sector/:id', sectorsController.getSectorById);
router.post('/curso-js-sector/crear', sectorsController.createSector);
router.patch('/curso-js-sector/editar/:id', sectorsController.editSector);


module.exports = router;
