import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:4000";
// const ENDPOINT = "http://192.168.43.250:8080";
const ENDPOINT = "wss://globaltalk-server.onrender.com";
// const ENDPOINT = "http://192.168.211.68:4000";


let socket = io(ENDPOINT, { transports: ['websocket'] });

export const getSocket = () => {
    if (socket) return socket;

    socket = io(ENDPOINT);
    return socket;
}


