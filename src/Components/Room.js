import React from "react";
import ReactPlayer from "react-player";
import DialingScreen from "./DialingScreen";
import endCall_icon from "../Images/accept_call.svg";
import audio_icon from "../Images/audio_icon.svg";
import "./myStyles.css"
import { VIDEO, VOICE, SCREEN_SHARE } from "../utility/constants";

const Room = ({ myStream, remoteStream, endCall, CALL_TYPE, receiverName, screenSharing }) => {
    if (CALL_TYPE === VOICE) {
        const audioContext = new (window.AudioContext || window?.webkitAudioContext)();
        const audioElement = new Audio();

        audioElement.srcObject = remoteStream;

        const sourceNode = audioContext.createMediaElementSource(audioElement);
        sourceNode.connect(audioContext.destination);

        audioElement.play();
    }
    return (
        <div className="fixed z-20 inset-0 bg-gray-800">
            {!remoteStream ? <DialingScreen endCall={endCall} receiverName={receiverName} screenSharing={screenSharing} />
                :
                <div className=" fixed inset-0  z-20 h-screen">
                    <button
                        onClick={endCall}
                        title="Hang up"
                        className="w-12 fixed bottom-5 right-2 md:right-[20%] lg:right-[35%] z-50 p-3.5 rounded-full bg-red-500 font-semibold text-white "
                    >
                        <img src={endCall_icon} alt="end call icon" />
                    </button>
                    {CALL_TYPE === VIDEO &&
                        // VIDEO CALL
                        <>
                            <div className=" fixed z-20">
                                <ReactPlayer

                                    playing
                                    height="8rem"
                                    width="7rem"
                                    url={myStream}
                                />
                            </div>
                            <div className=" fixed inset-0 z-10 ">
                                <ReactPlayer

                                    playing
                                    height="100%"
                                    width="100%"
                                    url={remoteStream}
                                />

                            </div>
                        </>
                    }
                    {CALL_TYPE === VOICE &&
                        // VOICE CALL
                        <div className="fixed inset-0 grid place-content-center">
                            <div className=" relative w-32 rounded-xl  p-7 " >
                                <div id="spin-container-1" className="absolute inset-0 border-2 border-bg-primary rounded-[40px] custom-anim-spin "></div>
                                <div id="spin-container-2" className="absolute inset-0 border-2 border-bg-primary rounded-[40px] custom-anim-spin "></div>
                                <div id="spin-container-3" className="absolute inset-0 border-2 border-bg-primary rounded-[40px] custom-anim-spin  "></div>

                                <img src={audio_icon} alt="audio icon" />
                            </div>
                        </div>
                    }
                    {CALL_TYPE === SCREEN_SHARE &&
                        <div className=" fixed inset-0 z-10 ">
                            <ReactPlayer
                                playing
                                height="100%"
                                width="100%"
                                url={remoteStream}
                            />
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Room;
