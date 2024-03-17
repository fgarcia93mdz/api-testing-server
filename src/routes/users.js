const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/curso-js-usuario/usuarios', usersController.getAllUsers);
router.get('/curso-js-usuario/:id', usersController.getUserById);
router.post('/curso-js-usuario/crear', usersController.createUser);
router.patch('/curso-js-usuario/:id', usersController.editUser);

router.get('/curso-js-rol/roles', usersController.getAllRoles);

module.exports = router;
