const admin = require('firebase-admin');

// const serviceAccount = require('/home/mo/Desktop/social-app-78122-firebase-adminsdk-pq5ol-b64735cf9b.json');

// had to also add the storage bucket to the initialization

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-app-78122.firebaseio.com",
  storageBucket: "gs://social-app-78122.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };