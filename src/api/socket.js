import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:4000";
const ENDPOINT = "http://192.168.43.250:4000";

let socket = io(ENDPOINT)

export const getSocket = () => {
    if (socket) return socket;

    socket = io(ENDPOINT);
    return socket;
}


