import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { getSocket } from "../api/socket";
import DialingScreen from "./DialingScreen";

// const socket = getSocket();
const Room = ({ myStream, remoteStream, stopStream }) => {
    console.log('ROOM Rendered...');
    // const [myStream, setMyStream] = useState();
    // const [remoteStream, setRemoteStream] = useState();

    //   const handleUserJoined = useCallback(({ email, id }) => {
    //     console.log(`Email ${email} joined room`);
    //     // setRemoteSocketId(id);
    //   }, []);

    // const handleCallUser = useCallback(async () => {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: true,
    //         video: true,
    //     });
    //     const offer = await peer.getOffer();
    //     socket.emit("user:call", { offer });
    //     setMyStream(stream);
    // }, [socket]);

    // const sendStreams = useCallback(() => {
    //     for (const track of myStream.getTracks()) {
    //         peer.peer.addTrack(track, myStream);
    //     }
    // }, [myStream]);

    // const handleIncommingCall = useCallback(
    //     //user knows who is the caller
    //     async ({ offer }) => {
    //         // setRemoteSocketId(from);
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             audio: true,
    //             video: true,
    //         });
    //         setMyStream(stream);
    //         console.log(`Incoming Call`, offer);
    //         const ans = await peer.getAnswer(offer);
    //         socket.emit("call:accepted", { ans });
    //     },
    //     [socket]
    // );

    // const handleCallAccepted = useCallback(
    //     //user knows who accepted
    //     ({ ans }) => {
    //         peer.setLocalDescription(ans);
    //         console.log("Call Accepted!");
    //         sendStreams();
    //     },
    //     [sendStreams]
    // );

    // const handleNegoNeeded = useCallback(async () => {
    //     const offer = await peer.getOffer();
    //     socket.emit("peer:nego:needed", { offer });
    // }, [socket]);

    // useEffect(() => {
    //     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    //     return () => {
    //         peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    //     };
    // }, [handleNegoNeeded]);

    // const handleNegoNeedIncomming = useCallback(
    //     async ({ offer }) => {
    //         const ans = await peer.getAnswer(offer);
    //         socket.emit("peer:nego:done", { ans });
    //     },
    //     [socket]
    // );

    // const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    //     await peer.setLocalDescription(ans);
    // }, []);

    // useEffect(() => {
    //     peer.peer.addEventListener("track", async (ev) => {
    //         const remoteStream = ev.streams;
    //         console.log("GOT TRACKS!!");
    //         setRemoteStream(remoteStream[0]);
    //     });
    // }, []);

    // useEffect(() => {
    //     // socket.on("user:joined", handleUserJoined);
    //     socket.on("incomming:call", handleIncommingCall);
    //     socket.on("call:accepted", handleCallAccepted);
    //     socket.on("peer:nego:needed", handleNegoNeedIncomming);
    //     socket.on("peer:nego:final", handleNegoNeedFinal);

    //     return () => {
    //         //   socket.off("user:joined", handleUserJoined);
    //         socket.off("incomming:call", handleIncommingCall);
    //         socket.off("call:accepted", handleCallAccepted);
    //         socket.off("peer:nego:needed", handleNegoNeedIncomming);
    //         socket.off("peer:nego:final", handleNegoNeedFinal);
    //     };
    // }, [
    //     socket,
    //     // handleUserJoined,
    //     handleIncommingCall,
    //     handleCallAccepted,
    //     handleNegoNeedIncomming,
    //     handleNegoNeedFinal,
    // ]);

    return (
        <div className="fixed z-20 h-screen">
            {!remoteStream ? <DialingScreen endCall={() => { alert('ENding Call...') }} />
                :
                <div className="fixed z-20 h-screen bg-white ">
                    <div className="fixed inset-0 z-20">
                        <ReactPlayer
                            playing
                            muted
                            height="8rem"
                            width="7rem"
                            url={myStream}
                        />
                    </div>

                    <div className="fixed inset-0 z-10 bg-gray-800">
                        <ReactPlayer
                            playing
                            muted
                            height="100%"
                            width="100%"
                            url={remoteStream}
                        />
                        <button
                            onClick={() => { alert('here') }}
                            className="fixed bottom-5 z-50 p-2 bg-bg-primary"
                        >Stop</button>
                    </div>

                </div>}

        </div>
    );
};

export default Room;
