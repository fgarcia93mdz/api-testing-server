const fs = require('fs');
const path = require('path');

const usersCursoJs = path.join(__dirname, '../json/users-curso-js.json');
const rolesCursoJs = path.join(__dirname, '../json/roles-curso-js.json');

function getAllUsers(req, res) {
  try {
    const usersData = fs.readFileSync(usersCursoJs, 'utf-8');
    const users = JSON.parse(usersData);
    const rolesData = fs.readFileSync(rolesCursoJs, 'utf-8');
    const roles = JSON.parse(rolesData);

    // Agregar información de roles a cada usuario
    users.forEach(user => {
      const userRole = roles.find(rol => rol.id === user.rol);
      if (userRole) {
        user.rol = userRole;
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

function getUserById(req, res) {
  const userId = parseInt(req.params.id);
  try {
    const usersData = fs.readFileSync(usersCursoJs, 'utf-8');
    const users = JSON.parse(usersData);
    const user = users.find(user => user.id === userId);
    if (user) {
      const rolesData = fs.readFileSync(rolesCursoJs, 'utf-8');
      const roles = JSON.parse(rolesData);
      const userRole = roles.find(role => role.id === user.role_id);
      users.forEach(user => {
        const userRole = roles.find(rol => rol.id === user.rol);
        if (userRole) {
          user.rol = userRole;
        }
      });
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

function createUser(req, res) {
  const newUser = req.body;
  try {
    const usersData = fs.readFileSync(usersCursoJs, 'utf-8');
    const users = JSON.parse(usersData);
    users.push(newUser);
    fs.writeFileSync(usersCursoJs, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al leer/escribir el archivo JSON:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

function getAllRoles(req, res) {
  try {
    const rolesData = fs.readFileSync(rolesCursoJs, 'utf-8');
    const roles = JSON.parse(rolesData);
    res.json(roles);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getAllRoles,
};
