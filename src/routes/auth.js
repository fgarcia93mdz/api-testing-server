const express = require('express');
const passport = require('passport');
const router = express.Router();

const { db } = require('../firebase');

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(400).json({ error: 'Error en la autenticación' }); }
    const userCopy = { ...user };
    delete userCopy.password;
    req.login(user, function (err) {
      if (err) { return next(err); }
      db.collection('roles').doc(user.rol.toString()).get()
        .then(roleDoc => {
          if (roleDoc.exists) {
            userCopy.rol = roleDoc.data();
          }
          res.json({ user: userCopy, message: '200' });
        })
        .catch(error => {
          console.error('Error al leer de Firestore:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        });
    });
  })(req, res, next);
});


router.get('/logout', function(req, res){
  req.logout();
  res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;