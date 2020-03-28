const functions = require('firebase-functions');

const app = require('express')();
const { getAllPosts, createPost } = require('./handlers/posts');
const { signup, login, uploadImage } = require('./handlers/users');

const config = require('./util/config');

// const config = {
//   apiKey: "AIzaSyC1gNDD1paJTgDWrD6d29d2vASMDMg_vuE",
//   authDomain: "social-app-78122.firebaseapp.com",
//   databaseURL: "https://social-app-78122.firebaseio.com",
//   projectId: "social-app-78122",
//   storageBucket: "social-app-78122.appspot.com",
//   messagingSenderId: "290878273269",
//   appId: "1:290878273269:web:44e93d31d8e4ca51d4f7bc",
//   measurementId: "G-0JEGPDC6C2"
// };

const FBAuth = require('./util/fbAuth');

const firebase = require('firebase');

// new addition to deal with DEFAULT App duplicate error
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}


//  post routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createPost);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);

// https://baseurl.com/api/screams

// deploys default to usa-central
exports.api = functions.region('europe-west2').https.onRequest(app);

// exports.api = functions.https.onRequest(app)


// eyJhbGciOiJSUzI1NiIsImtpZCI6IjgzYTczOGUyMWI5MWNlMjRmNDM0ODBmZTZmZWU0MjU4Yzg0ZGI0YzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLWFwcC03ODEyMiIsImF1ZCI6InNvY2lhbC1hcHAtNzgxMjIiLCJhdXRoX3RpbWUiOjE1ODUzODg2MzYsInVzZXJfaWQiOiJPNEZhaFV3WWhFYlRmQ0E5RzZ5U2FCQXliaEIyIiwic3ViIjoiTzRGYWhVd1loRWJUZkNBOUc2eVNhQkF5YmhCMiIsImlhdCI6MTU4NTM4ODYzNiwiZXhwIjoxNTg1MzkyMjM2LCJlbWFpbCI6Im1vYW1yckBnZy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibW9hbXJyQGdnLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.M45ZWP3A_rpR8PDhRdq-KpKI0Lo9kez-ns0HPoyxQ62TYO7quH-BJhHEKfHezycIYyBaT0pzClQM0DXo2pGoeRZ9d7atAA4L1IGF5RW_qb1wC0Fbxb4okDA1oiUxIEeF6hmLVcL200HaxfZFd5EXKSXVZdLNiq7VhK2CKcEKDQI612Ebt-9i5QywDDxIiQ-AIv5uBz3YdBON4brnxpGWXZ1QMqMR_9JCJPrqtBLbTOM69T9tzrR29t9C8lNB0AaLwtHwLChmntf2zTIgHhZYtKq1gH_sdFJJUBR5vXypQZvhgTMmIQd4MXnXkEXDS4HEuDgMEdOlQv3palMl7M55cg