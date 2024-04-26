import React from "react";
import ImageChat from "./ImageChat";
import tick_icon from "../Images/tick.svg";

function MessageSelf({ message, hasMedia, fileName, mimetype }) {

  return (
    <div className="flex justify-end ">
      {hasMedia ?
        <ImageChat filename={fileName} mimetype={mimetype} selfMessage={true} />
        :
        <div className=" flex gap-1 items-end text-white max-w-[300px] ml-10 w-fit bg-bg-primary px-2 py-2 rounded-md rounded-br-none ">
          <div className=" ">{message}</div>
          <img className="w-[14px] h-[14px] mb-1" src={tick_icon} alt="timer" />
        </div>
      }
    </div>
  );
}

export default MessageSelf;
