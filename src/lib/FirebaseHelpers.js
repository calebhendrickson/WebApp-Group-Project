/* eslint-disable no-unused-vars */
import firebase from 'firebase'

function createUser (uid, username) {
  let newUser = {
    username: username,
    bio: '',
    address: '',
    phone: '',
    posts: []
  }

  return new Promise((resolve, reject) => {
    // first create user in usernames array
    firebase.database().ref('usernames/' + username).set(uid).then(() => {
      // if successful create actual user object
      firebase.database().ref('users/' + uid).set(newUser).then(() => {
        // on complete success return new user object
        resolve(newUser)
      }).catch(error => {
        // failure for creating user entry
        reject(error)
      })
    }).catch(error => {
      // failure for creating username entry
      reject(error)
    })
  })
}

function editUser (uid, updates) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/' + uid).update(updates).then(() => {
      resolve(updates)
    }).catch(error => {
      reject(error)
    })
  })
}

function getAuthedUserRef (uid) {
  let authedUser = firebase.database().ref('/users/' + uid)
  return authedUser
}

/**
 * Get a user from the `/users/` list by their uid
 * @param  {[string]} uid [User's uid]
 * @return {[Object]}     [new Promise with a user object or error]
 */
function getUserByUid (uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/' + uid).once('value').then(snapshot => {
      resolve(snapshot.val())
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * Create a post as an authorized user. Post should look like:
 * {
 *  title: [string],
 *  description: [string],
 *  datetime: [Date],
 *  public: [bool], // true for public, false for only friends
 *  location: [string], // location of event that can be looked up by google maps
 *  maxMembers: [number]
 * }
 * @param  {[Object]} post [post object]
 */
function createPost (post) {
  getUserByUid(firebase.auth().currentUser.uid).then((user) => {
    // build post from post param
    let sanitizedPost = {
      title: post.title,
      author: user.username,
      description: post.description,
      timestamp: Date.now(),
      datetime: post.datetime.getTime(),
      location: post.location,
      maxMembers: post.maxMembers,
      members: []
    }

    // put post in the current user's list of posts
    let newCurrentUserPostRef = firebase.database().ref('posts/' + firebase.auth().currentUser.uid).push()
    newCurrentUserPostRef.set(sanitizedPost)

    // put post in each friends feed
    // cancel out if no friends
    if (user.friends && !(user.friends.length > 0)) {
      for (let friend in user.friends) {
        // skip friend if the post blocks them
        if (post.blockedFriends.includes(friend)) continue
        let newFriendPostRef = firebase.database().ref('feed/' + friend).push()
        newFriendPostRef.set(sanitizedPost)
      }
    }

    // put post in public posts
    if (post.public) {
      let newPublicPostRef = firebase.database().ref('public/').push()
      newPublicPostRef.set(sanitizedPost)
    }
  })
}

function getUserPosts (uid) {
  return getFirebaseList('posts/' + uid)
}

function getFriendPosts () {
  return getFirebaseList('feed/' + firebase.auth().currentUser.uid)
}

function getPublicPosts () {
  return getFirebaseList('public/')
}

function getFirebaseList (ref) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(ref).once('value', snapshot => {
      if (snapshot) {
        let posts = []
        snapshot.forEach(childSnapshot => {
          posts.unshift(Object.assign({}, {key: childSnapshot.key}, childSnapshot.val()))
        })
        resolve(posts)
      } else {
        resolve([])
      }
    }).catch(error => reject(error))
  })
}

export default {
  createPost,
  createUser,
  editUser,
  getUserByUid,
  getAuthedUserRef,
  getUserPosts,
  getFriendPosts,
  getPublicPosts
}
