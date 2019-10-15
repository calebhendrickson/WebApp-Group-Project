import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyABRvMmKWowpg38G0EiUEG91CEBBh7lnkw',
  authDomain: 'heroic-builder-167814.firebaseapp.com',
  databaseURL: 'https://heroic-builder-167814.firebaseio.com',
  projectId: 'heroic-builder-167814',
  storageBucket: '',
  messagingSenderId: '169080860797'
}
firebase.initializeApp(config)

export default firebase
