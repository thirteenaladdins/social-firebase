const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

const serviceAccount = require('/home/mo/Desktop/social-app-78122-firebase-adminsdk-pq5ol-b64735cf9b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-app-78122.firebaseio.com"
});

// admin.initializeApp();

const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyC1gNDD1paJTgDWrD6d29d2vASMDMg_vuE",
    authDomain: "social-app-78122.firebaseapp.com",
    databaseURL: "https://social-app-78122.firebaseio.com",
    projectId: "social-app-78122",
    storageBucket: "social-app-78122.appspot.com",
    messagingSenderId: "290878273269",
    appId: "1:290878273269:web:44e93d31d8e4ca51d4f7bc",
    measurementId: "G-0JEGPDC6C2"
  };

const db = admin.firestore();

firebase.initializeApp(config);

app.get('/posts', (req, res) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
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



// token for middleware... 
// cors headers? django takes care of this with a package
const FBAuth = (req, res, next) => {
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found')
    return res.status(403).json({ error: 'Unauthorized'});
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log(decodedToken);
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token', err);
      return res.status(403).json(err);
    })
}

app.post('/post', FBAuth, (req, res) => {
  if (req.body.body.trim() === '' ) {
    return res.status(400).json({ body: 'Body must not be empty'});
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.user.userHandle,
    createdAt: new Date().toISOString()
  }

  db.collection('posts')
    .add(newPost)
    .then((doc) => {
       return res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch((err) => {
      res.status(500).json({ error: `Something went wrong`})
      console.error(err)
    });
})

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}

const isEmail = (email) => {
  // is there a better format for this?
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
}


// TODO: validate data
// function to check unique username on signup

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = 'Field must not be empty'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isEmpty(newUser.password)) errors.password = 'Field must not be empty';
  if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
  if (isEmpty(newUser.handle)) errors.handle = 'Field must not be empty';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);


  let token;
  let userIdStore;

  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        return res.status(400).json({ handle: 'this username is already taken'})
      } else {
        return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    // get an authentication token, what's this for? Validating emails?
    .then(data => {
      userIdStore = data.user.uid;
      return data.user.getIdToken()
    })
    .then(tokenId => {
      token = tokenId;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email, 
        createdAt: new Date().toISOString(),
        userId: userIdStore
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use'});
      } else {
        return res.status(500).json({ error: err.code });
      }      
    })
    
})

app.post('/login', (req, res) => {
  const user = {
    email: req.body.email, 
    password: req.body.password
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Field must not be empty';
  if (isEmpty(user.password)) errors.password = 'Field must not be empty';
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({token});
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'Wrong credentials, please try again. '})
      }
      return res.status(500).json({error: err.code})
    })

})

// https://baseurl.com/api/screams

// deploys default to usa-central
exports.api = functions.region('europe-west2').https.onRequest(app);

// exports.api = functions.https.onRequest(app)


