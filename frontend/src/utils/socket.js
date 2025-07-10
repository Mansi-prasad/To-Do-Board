import { io } from "socket.io-client";

// Retrieve the token early
const token = localStorage.getItem("token");
console.log("Connecting socket with token:", token);

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  auth: {
    token,
  },
  // Optional: force new connection each time
  autoConnect: true,
  transports: ["websocket"], // Prefer websocket over polling
});

// Debug logs
socket.on("connect", () => {
  console.log(" Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
});
