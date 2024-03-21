const express = require('express');
const usersRoutes = require('./src/routes/users');
const sectorsRoutes = require('./src/routes/sectors');
const passport = require('passport');
require('./src/passport-config');
const auth = require('./src/routes/auth');

const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;

const cors = require('cors');

app.use(cors());

app.use(session({
  secret: 'asd123fgh456jkl678',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

app.use('/api/users', usersRoutes);
app.use('/api/sectors', sectorsRoutes);
app.use('/api/auth', auth);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
