var admin = require('firebase-admin');

var serviceAccount = require('../util/firebaseAdminSDK.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const fcm = admin.messaging();
