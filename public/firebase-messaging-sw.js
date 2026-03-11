importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC5a4LBue2XV-4haynToxruLjAPmJ6Jd-4",
 
  authDomain: "hibotalk.firebaseapp.com",
 
  projectId: "hibotalk",
 
  storageBucket: "hibotalk.firebasestorage.app",
 
  messagingSenderId: "1038006508037",
 
  appId: "1:1038006508037:web:9194eb1aa1299a8b681a6c",
 
  measurementId: "G-6GX61BRCQ5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background notification:", payload);

  const title =
    payload.notification?.title || payload.data?.title || "New Notification";
  const body =
    payload.notification?.body || payload.data?.body || "";

  self.registration.showNotification(title, {
    body: body,
    icon: "/notifications.png"
  });
});