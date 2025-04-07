// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
    if (!socket && typeof window !== "undefined") {
        socket = io("https://newsocket-production.up.railway.app/", {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });
      
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });
      
        socket.on("connect_error", (err) => {
          console.error("Connection error:", err);
        });
      
        socket.on("disconnect", (reason) => {
          console.warn("Disconnected:", reason);
        });
      
        socket.on("reconnect_attempt", (attempt) => {
          console.log("Reconnection attempt:", attempt);
        });
      }
      
  return socket;
};
