import React from 'react'
import profilePlaceholder from "../Images/profile_placeholder.jpg";

const IncomingCall = ({ endCall, answerCall }) => {
  const callerName = "John doe";
  const callerNumber = 700601734734;
  const callerImage = profilePlaceholder;


  const acceptCall = () => {

  }

  const declineCall = () => {

  }
  return (

    <div className=" fixed inset-0 z-20 flex flex-col items-center justify-center w-full h-screen bg-black/60 text-white">
      <div className=' flex flex-col items-center justify-between shadow-xl w-[320px] h-[380px] bg-bg-primary px-2 py-8 rounded-lg'>
        <div className="rounded-full  overflow-hidden w-32 h-32 mb-4 mx-auto">
          <img
            src={callerImage}
            alt={`${callerName}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className='flex flex-col items-center'>
          <h2 className="text-2xl font-semibold mb-2">{callerName}</h2>
          <p className="text-gray-300 mb-4">Incoming Call</p>
          <div className=" flex gap-5">
            <button
              onClick={answerCall}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2">

              Answer
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

    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
    //   <div className="bg-white w-96 p-8 rounded-lg shadow-md">
    //     <div className="text-center mb-4">
    //       <p className="text-xl font-semibold">Incoming Call</p>
    //       <p className="text-gray-500">From {callerName}</p>
    //       <p className="text-gray-500">{callerNumber}</p>
    //     </div>

    //     <div className="flex justify-center">
    //       <button
    //         className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mr-4">
    //         onClick={acceptCall}
    //         Answer
    //       </button>
    //       <button
    //         className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full">
    //         onClick={declineCall}
    //         Decline
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};


export default IncomingCall