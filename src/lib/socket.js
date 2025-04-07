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
  }
  return socket;
};
