// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// const serviceAccount = require("../functions/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://chat-demo-f2a33-default-rtdb.firebaseio.com"
// });

// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database.ref("/users/{uid}").onUpdate((snapshot) => {
  const newMessagesCount = snapshot.data().newMessagesCount;
  if (newMessagesCount > 0) {
    // This registration token comes from the client FCM SDKs.
    const message = {
      notification: {
        title: "Notification from chat-demo",
        body: `You have ${newMessagesCount} unread messages`,
      },
      token: snapshot.data().fcmToken
    };

    // Send a message to the device corresponding to the provided registration token.
    admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message:', response);
    }).catch((error) => {
      console.log('Error sending message:', error);
    });
  }
});