import firebase from "firebase/app"
import "firebase/auth"
import "firebase/analytics"
// import "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyCMJeG8Hp7WGx0DJAcZ2HA0YK0vlPWr2LA",
  authDomain: "chat-demo-f2a33.firebaseapp.com",
  projectId: "chat-demo-f2a33",
  storageBucket: "chat-demo-f2a33.appspot.com",
  messagingSenderId: "509444953763",
  appId: "1:509444953763:web:dfd27c9427988d87b11116",
  measurementId: "G-G8H45G5KQ1",
}

firebase.initializeApp(firebaseConfig)

firebase.analytics()

// const messaging = firebase.messaging()
// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// messaging.getToken({ vapidKey: "BHMmCujW0_qNIJtVWsiI5pMup6tRD2JdJexvX3mY60kaYBJ53Vr4EYGKZ7HKDGIpmzO7OLqergx8gTD20nSajMM" }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     console.log("Your currentToken is " + currentToken)
//     firebase.database().ref("users").child(uid).update({
//       fcmToken: currentToken,
//     })
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.')
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err)
// })

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload)
// })
