// lib/socket.js
import { io } from "socket.io-client";

const socket = io("https://newsocket-production.up.railway.app/",{
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

export default socket;



