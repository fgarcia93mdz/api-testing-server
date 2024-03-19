const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { db } = require('./firebase');

passport.use(new LocalStrategy(
  function (username, password, done) {
    db.collection('users').where('usuario', '==', username).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const user = snapshot.docs[0].data();
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
        });
      })
      .catch(error => {
        return done(error);
      });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('ID:', id);
  db.collection('users').doc(String(id)).get()
    .then(doc => {
      if (!doc.exists) {
        return done(null, false);
      }

      return done(null, doc.data());
    })
    .catch(error => {
      return done(error);
    });
});