const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/curso-js-usuario/usuarios', usersController.getAllUsers);
router.get('/curso-js-usuario/:id', usersController.getUserById);
router.post('/curso-js-usuario/crear', usersController.createUser);
router.patch('/curso-js-usuario/editar/:id', usersController.editUser);

router.get('/curso-js-rol/roles', usersController.getAllRoles);
// router.get('/curso-js-rol/:id', usersController.getRoleById);
router.post('/curso-js-rol/crear', usersController.createRole);
router.patch('/curso-js-rol/editar/:id', usersController.editRole);


module.exports = router;
