import React from "react";
import ImageChat from "./ImageChat";

function MessageSelf({ message, hasMedia, fileName, mimetype }) {
  // console.log("Message self Prop : ", props);
  // if (hasMedia)
  //   console.log('MessageSelf ::  MIMETYPE = ' + mimetype + ' FILENAME = ' + fileName)

  return (
    <div className="flex justify-end ">
      {hasMedia ?
        <ImageChat filename={fileName} mimetype={mimetype} selfMessage={true} />
        :
        <div className=" text-white max-w-[300px] ml-10 w-fit bg-bg-primary px-3 py-2 rounded-md rounded-br-none ">
          <p >{message}</p>
        </div>
      }
    </div>
  );
}

export default MessageSelf;
