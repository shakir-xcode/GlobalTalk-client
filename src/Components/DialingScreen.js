import React, { useEffect, useRef } from "react";
import { getSocket } from "../api/socket";
import profilePlaceholder from "../Images/profile_placeholder.jpg";
import Dots from "./animations/Dots";
import declineCall from "../Images/decline_call.svg";

// let socket;
// const CallingScreen = () => {
//   useEffect(() => {
//     socket = getSocket();
//     console.log("CALLING RENDERED: ", socket);
//   }, []);
//   return <div>CallingScreen</div>;
// };

function DialingScreen({ endCall }) {
  const callerName = "John doe";
  const callerImage = profilePlaceholder;
  return (
    <div className="fixed inset-0 z-20 h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className=" p-3 flex flex-col gap-1 items-center">
        <div className="w-[120px] bg-gray-700 rounded-full mb-2 flex items-center justify-center">
          <img src={profilePlaceholder} alt="profile" className="rounded-full " />
        </div>
        <p className="font-semibold text-xl">{callerName}</p>
        <div className="font-thin">Dialling<Dots /></div>

        {/* <span>01:43</span> This should be dynamic to show the actual call duration */}
      </div>

      <div className="flex flex-col gap-1 mt-5 items-center ">
        <button
          onClick={endCall}
          className="w-12 bg-red-500 p-4 rounded-full hover:bg-red-400">
          {/* Replace with phone hangup icon */}
          <img src={declineCall} />
        </button>

        {/* Add more buttons as needed and style accordingly */}
      </div>
    </div>
  );
}

export default DialingScreen;
