const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();


// const serviceAccount = require('/home/mo/Desktop/social-app-78122-firebase-adminsdk-pq5ol-b64735cf9b.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://social-app-78122.firebaseio.com"
// });

admin.initializeApp();

app.get('/posts', (req, res) => {
  admin.firestore().collection('posts').get()
    .then((data) => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(posts);
    })
    .catch(err => console.error(err))
})

app.post('/post', (req, res) => {

  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  }

  admin.firestore()
    .collection('posts')
    .orderBy('createdAt', 'descending')
    .add(newPost)
    .then((doc) => {
       return res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch((err) => {
      res.status(500).json({ error: `Something went wrong`})
      console.error(err)
    });
})

// https://baseurl.com/api/screams

exports.api = functions.https.onRequest(app);