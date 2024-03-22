const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const { db } = require('../firebase');

function getAllUsers(req, res) {
  db.collection('users').get()
    .then(snapshot => {
      const users = [];
      const promises = [];
      snapshot.forEach(doc => {
        const user = doc.data();
        user.id = doc.id;
        if (typeof user.rol === 'number') {
          const promise = db.collection('roles').doc(user.rol.toString()).get()
            .then(roleDoc => {
              if (roleDoc.exists) {
                user.rol = roleDoc.data();
              }
            });
          promises.push(promise);
        }
        users.push(user);
      });
      return Promise.all(promises).then(() => users);
    })
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.error('Error al leer de Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function getUserById(req, res) {
  const userId = req.params.id;
  db.collection('users').doc(userId).get()
    .then(doc => {
      if (doc.exists) {
        const user = doc.data();
        user.id = doc.id;
        return db.collection('roles').doc(user.rol.toString()).get()
          .then(roleDoc => {
            if (roleDoc.exists) {
              user.rol = roleDoc.data();
            }
            return user;
          });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.error('Error al leer de Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function createUser(req, res) {
  let newUser = req.body;
  if (newUser === null || newUser === undefined) {
    res.status(400).json({ error: 'Petición inválida' });
    return;
  }

  newUser.rol = parseInt(newUser.rol);

  db.collection('users')
    .where('usuario', '==', newUser.usuario)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        res.status(400).json({ error: 'El nombre de usuario ya existe' });
        return;
      }

      db.collection('users')
        .orderBy('id', 'desc')
        .limit(1)
        .get()
        .then(snapshot => {
          let lastId = 0;
          snapshot.forEach(doc => {
            lastId = doc.data().id;
          });

          newUser.id = lastId + 1;

          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) {
              console.error('Error al encriptar la contraseña:', err);
              res.status(500).json({ error: 'Error interno del servidor' });
              return;
            }

            newUser.password = hash;

            db.collection('users').doc(newUser.id.toString()).set(newUser)
              .then(() => {
                res.status(201).json({ message: 'Usuario creado', id: newUser.id });
              })
              .catch(error => {
                console.error('Error al escribir en Firestore:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
              });
          });
        })
        .catch(error => {
          console.error('Error al obtener el último usuario:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        });
    })
    .catch(error => {
      console.error('Error al verificar el nombre de usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function editUser(req, res) {
  const userId = req.params.id;
  let updatedUser = req.body;

  if (updatedUser.rol !== undefined && updatedUser.rol !== '1') {
    updatedUser.rol = parseInt(updatedUser.rol);
  } else {
    delete updatedUser.rol;
  }

  db.collection('users').doc(userId).update(updatedUser)
    .then(() => {
      res.json({message: 'Usuario actualizado', usuario: updatedUser.usuario});
    })
    .catch(error => {
      console.error('Error al escribir en Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function getAllRoles(req, res) {
  db.collection('roles').get()
    .then(snapshot => {
      const roles = [];
      snapshot.forEach(doc => {
        const rol = doc.data();
        rol.id = doc.id;
        roles.push(rol);
      });
      res.json(roles);
    })
    .catch(error => {
      console.error('Error al leer de Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function createRole(req, res) {
  let nombre = req.body;
  if (nombre === null || nombre === undefined ) {
    res.status(400).json({ error: 'Petición inválida' });
    return;
  }

  db.collection('roles')
    .where('nombre', '==', nombre)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        res.status(400).json({ error: 'El nombre del rol ya existe' });
        return;
      }

      db.collection('roles')
        .orderBy('id', 'desc')
        .limit(1)
        .get()
        .then(snapshot => {
          let lastId = 0;
          snapshot.forEach(doc => {
            lastId = doc.data().id;
          });

          nombre.id = lastId + 1;

          db.collection('roles').doc(nombre.id.toString()).set(nombre)
            .then(() => {
              res.status(201).json({ message: 'Rol creado', id: nombre.id });
            })
            .catch(error => {
              console.error('Error al escribir en Firestore:', error);
              res.status(500).json({ error: 'Error interno del servidor' });
            });
        })
        .catch(error => {
          console.error('Error al obtener el último rol:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        });
    })
    .catch(error => {
      console.error('Error al verificar el nombre del rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function editRole(req, res) {
  const roleId = req.params.id;
  let updatedRole = req.body;

  let roleToUpdate = { nombre: updatedRole.nombre };

  db.collection('roles').doc(roleId).update(roleToUpdate)
    .then(() => {
      res.json({ message: 'Rol actualizado', rol: updatedRole.nombre});
    })
    .catch(error => {
      console.error('Error al escribir en Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  getAllRoles,
  createRole,
  editRole
};