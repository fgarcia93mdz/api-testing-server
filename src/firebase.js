const admin = require('firebase-admin');
const serviceAccount = require('../api-testin-fgg-firebase-adminsdk-rx88m-1d4b033cbb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };