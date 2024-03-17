const express = require('express');
const usersRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

const admin = require('firebase-admin');
const serviceAccount = require('./api-testin-fgg-firebase-adminsdk-rx88m-1d4b033cbb.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// const roles = [
//   {
//     "id": 1,
//     "nombre": "Gerencia"
//   },
//   {
//     "id": 2,
//     "nombre": "Jefatura"
//   },
//   {
//     "id": 3,
//     "nombre": "Supervisor"
//   },
//   {
//     "id": 4,
//     "nombre": "Operador"
//   }
// ]

// Promise.all(roles.map(rol => db.collection('roles').doc(rol.id.toString()).set(rol)))
//   .then(() => {
//     console.log('Todos los usuarios se han insertado correctamente.');

//     // Ahora puedes comenzar a escuchar en tu puerto
//     app.listen(PORT, () => {
//       console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
//     });
//   })
//   .catch(error => {
//     console.error('Error al insertar usuarios:', error);
//   });


app.get('/api/check-connection', async (req, res) => {
  try {
    const snapshot = await db.collection('roles').get();
    const roles = snapshot.docs.map(doc => doc.data());
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
