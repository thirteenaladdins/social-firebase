// properties of a post
// you are chargd for the amount of reads with firebase

let db = {
  users: [
    {
      userId: "h324234j234ksdrds",
      email: "viktorthehitman@russianhitmenforhire.com",
      username: "hitmanviktor",
      createdAt: "2020-03-29T12:55:19.850Z",
      imageUrl: "image/ssdfasd/dfkjd",
      bio: "Hello, my name is Viktor and you are going to die. ",
      website: "https://viktorthehitman.com",
      location: "Lurking in the shadows"
    }
  ],
  posts: [
    {
      userHandle: "user",
      body: "this is the post body",
      createdAt: "2020-03-27T18:44:34.555Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      postId: "awesakjwerlk223",
      body: "Nice one, son.",
      createdAt: "2020-03-27T18:44:34.555Z"
    }
  ],
  notifications: [
    {
      recipients: "user",
      sender: "John",
      read: "true | false",
      postId: "asdfjiewai3i",
      type: "like | comment",
      createdAt: "2020-03-29T18:44:34.555Z"
    }
  ]
};

const userDetails = {
  credentials: {
    userId: "h324234j234ksdrds",
    email: "viktorthehitman@russianhitmenforhire.com",
    username: "hitmanviktor",
    createdAt: "2020-03-29T12:55:19.850Z",
    imageUrl: "image/ssdfasd/dfkjd",
    bio: "Hello, my name is Viktor and you are going to die. ",
    website: "https://viktorthehitman.com",
    location: "Lurking in the shadows"
  },
  likes: [
    {
      username: "user",
      postId: "hh234jjj22k3i1kIer"
    },
    {
      username: "user",
      postId: "3Ioodf0eriwka23kd"
    }
  ]
};
