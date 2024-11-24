import { io } from "socket.io-client";
const ENDPOINT =  "wss://global-talk-server.vercel.app/"
//const ENDPOINT = "wss://globaltalk-server.onrender.com";
// const ENDPOINT = "192.168.43.250:8080";



let socket = io(ENDPOINT, { transports: ['websocket'] });

export const getSocket = () => {
    if (socket) return socket;

    socket = io(ENDPOINT);
    return socket;
}


