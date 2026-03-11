import { io } from "socket.io-client";

const socket = io("http://18.142.77.59:5000", {
  transports: ["websocket"],
});

export default socket;