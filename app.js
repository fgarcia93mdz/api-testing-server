const express = require('express');
const usersRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
