const { db } = require('../util/admin');

exports.getAllPosts = (req, res) => {
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
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code })
    })
}

exports.createPost = (req, res) => {
  if (req.body.body.trim() === '' ) {
    return res.status(400).json({ body: 'Body must not be empty'});
  }

  // once the user is logged in you should be able to get the user's details
  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
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
}