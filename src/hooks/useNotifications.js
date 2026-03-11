import { useEffect } from "react";
import { messaging } from "../firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

const useNotifications = () => {
  useEffect(() => {
    // ✅ Returns unsubscribe function — prevents duplicate listeners
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);

      const title =
        payload.notification?.title || payload.data?.title || "Notification";
      const body =
        payload.notification?.body || payload.data?.body || "";

      // ✅ Show toast (removed alert — it blocks rendering)
      toast.success(`${title}: ${body}`);

      // ✅ Browser notification with proper permission check
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: body,
          icon: "/notifications.png"
        });
      }
    });

    // ✅ Cleanup on unmount
    return () => unsubscribe();
  }, []);
};

export default useNotifications;