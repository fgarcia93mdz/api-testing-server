const fs = require('fs');
const path = require('path');

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
  const newUser = req.body;
  if (newUser === null || newUser === undefined) {
    res.status(400).json({ error: 'Petición inválida' });
    return;
  }

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

          db.collection('users').add(newUser)
            .then(docRef => {
              res.status(201).json({message: 'Usuario creado', id: docRef.id});
            })
            .catch(error => {
              console.error('Error al escribir en Firestore:', error);
              res.status(500).json({ error: 'Error interno del servidor' });
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
  const updatedUser = req.body;
  db.collection('users').doc(userId).update(updatedUser)
    .then(() => {
      res.json({message: 'Usuario actualizado'});
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  getAllRoles,
};