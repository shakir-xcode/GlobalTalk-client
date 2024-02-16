import React from 'react'
import profilePlaceholder from "../Images/profile_placeholder.jpg";
import { SCREEN_SHARE, VIDEO, VOICE } from '../utility/constants';

const IncomingCall = ({ endCall, answerCall, CALL_TYPE, callerName, }) => {
  // const callerName = "John doe";
  const callerNumber = 7006017347;
  const callerImage = profilePlaceholder;

  return (

    <div className=" fixed inset-0 z-20 flex flex-col items-center justify-center w-full h-screen bg-black/60 text-white">
      <div className=' flex flex-col items-center justify-between shadow-xl w-[320px] h-[380px] bg-bg-primary px-2 py-8 rounded-lg'>
        <div className="rounded-full  overflow-hidden w-32 h-32 mb-2 mx-auto">
          <img
            src={callerImage}
            alt={`${callerName}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-auto">{callerName}</h2>


        <div className='flex flex-col items-center'>
          {CALL_TYPE === SCREEN_SHARE ?
            <p className="text-gray-300 mb-6 text-lg">Wants to share screen</p>
            :
            <p className="text-gray-300 mb-4 text-lg">Incoming {CALL_TYPE} call</p>}
          <div className=" flex gap-5">
            <button
              onClick={answerCall}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2">

              {CALL_TYPE === SCREEN_SHARE ? "Accept" : "Answer"}
            </button>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded">
              Decline
            </button>
          </div>
        </div>

      </div>
    </div>


  );
};


export default IncomingCall