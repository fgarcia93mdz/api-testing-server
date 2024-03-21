const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const { db } = require('../firebase');

function getAllSector(req, res) {
  db.collection('sectors').get()
    .then(snapshot => {
      const sectors = [];
      snapshot.forEach(doc => {
        const sector = doc.data();
        sector.id = doc.id;
        sectors.push(sector);
      });
      res.json(sectors);
    })
    .catch(error => {
      console.error('Error al leer de Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function getSectorById(req, res) {
  const sectorId = req.params.id;
  db.collection('sectors').doc(sectorId).get()
    .then(doc => {
      if (doc.exists) {
        const sector = doc.data();
        sector.id = doc.id;
        res.json(sector);
      } else {
        res.status(404).json({ message: 'Sector no encontrado' });
      }
    })
    .catch(error => {
      console.error('Error al leer de Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function createSector(req, res) {
  const { sector } = req.body;
  let newId;

  db.collection('sectors').where('sector', '==', sector).get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return res.status(400).json({ message: 'El sector ya existe' });
      }
      return db.collection('sectors').orderBy('id', 'desc').limit(1).get();
    })
    .then(snapshot => {
      if (!snapshot) {
        return;
      }

      let lastId = 0;
      snapshot.forEach(doc => {
        lastId = doc.data().id;
      });

      newId = lastId + 1;
      return db.collection('sectors').doc(newId.toString()).set({
        id: newId,
        sector
      });
    })
    .then(() => {
      if (!newId) {
        return;
      }

      res.status(200).json({ message: 'Sector creado con éxito'});
    })
    .catch(error => {
      console.error('Error al escribir en Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}

function editSector(req, res) {
  const sectorId = req.params.id;
  const { sector } = req.body;
  db.collection('sectors').doc(sectorId).update({
    sector
  })
    .then(() => {
      res.status(200).json({ message: 'Sector actualizado exitosamente' });
    })
    .catch(error => {
      console.error('Error al escribir en Firestore:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
}


module.exports = {
  getAllSector,
  getSectorById,
  createSector,
  editSector
};