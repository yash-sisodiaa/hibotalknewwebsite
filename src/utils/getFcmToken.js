import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFcmToken = async () => {
  try {
     
    if (
      window.location.protocol !== "https:" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !messaging
    ) {
      console.log(" Firebase disabled");
      return null;
    }
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: "BDKyrn73RbJ5TwzdgbvbOhw_erRRxOhEwmZBuz0kia8DkTn6jQ0Ri79B2QridoYV2dHw03uh3Q-ilzCm7fkOicw",
      serviceWorkerRegistration: registration
    });

    console.log("New FCM Token:", token);

    return token;

  } catch (error) {
    console.error("FCM Token error:", error);
  }
};