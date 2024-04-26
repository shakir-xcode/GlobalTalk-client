import { io } from "socket.io-client";
const ENDPOINT = "wss://globaltalk-server.onrender.com";


let socket = io(ENDPOINT, { transports: ['websocket'] });

export const getSocket = () => {
    if (socket) return socket;

    socket = io(ENDPOINT);
    return socket;
}


