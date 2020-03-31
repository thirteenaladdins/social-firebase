const functions = require('firebase-functions');

const app = require('express')();
const { getAllPosts, createPost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

const config = require('./util/config');

const { admin, db } = require('./util/admin');
const FBAuth = require('./util/fbAuth');
const firebase = require('firebase');

// new addition to deal with DEFAULT App duplicate error
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
//  post routes
app.get('/posts', getAllPosts);
app.get('/post/:postId', getPost);

app.post('/post', FBAuth, createPost);

// comment on post
app.post('/post/:postId/comment', FBAuth, commentOnPost);

// delete post
app.delete('/post/:postId', FBAuth, deletePost);
// like post
app.get('/post/:postId/like', FBAuth, likePost);
// unlike post
app.get('/post/:postId/unlike', FBAuth, unlikePost);

// user routes
app.post('/signup', signup);
app.post('/login', login);

app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);


// https://baseurl.com/api/

// deploys default to usa-central
exports.api = functions.region('europe-west2').https.onRequest(app);

// exports.api = functions.https.onRequest(app)

exports.createNotificationOnLike = functions.region('europe-west2').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like', 
            read: false,
            postId: doc.id
          });
        }
        return;
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      })
      
  })

  exports.deleteNotificationOnUnlike = functions
    .region('europe-west2')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
      db.doc(`/notifications/${snapshot.id}`)
        .delete()
        .then(() => {
          return;
        })
        .catch((err) => {
          console.error(err);
          return;
        })
    })


  exports.createNotificationOnComment = functions.region('europe-west2')
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
      db.doc(`/posts/${snapshot.data().postId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment', 
            read: false,
            postId: doc.id
          });
        }
        return;
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      })

    })