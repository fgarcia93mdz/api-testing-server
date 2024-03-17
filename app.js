const express = require('express');
const usersRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

//test

app.use(express.json());
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
