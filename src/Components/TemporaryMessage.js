import React from "react";
import ImageChat from "./ImageChat";
import timer_icon from "../Images/timer.svg";

function TemporaryMessage({ message, hasMedia, fileName, mimetype }) {

    return (
        <div className="flex justify-end ">
            {hasMedia ?
                <ImageChat filename={fileName} mimetype={mimetype} selfMessage={true} />
                :
                <div className=" flex  items-end  gap-2  text-white max-w-[300px] ml-10 w-fit bg-bg-primary px-3 py-2 rounded-md rounded-br-none ">
                    <div className=" ">{message}</div>
                    <img className="w-[9px] h-[9px] mb-1" src={timer_icon} alt="timer" />
                </div>
            }
        </div>
    );
}

export default TemporaryMessage;
