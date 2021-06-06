// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js")

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
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

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
// const messaging = firebase.messaging()

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload)
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     // icon: '/firebase-logo.png'
//   }

//   self.registration.showNotification(notificationTitle, notificationOptions)
// })
