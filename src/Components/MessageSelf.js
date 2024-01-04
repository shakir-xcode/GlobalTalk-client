import React from "react";

function MessageSelf(props) {
  // console.log("Message self Prop : ", props);
  return (
    <div className="flex justify-end ">
      <div className=" text-white max-w-[300px] ml-10 w-fit bg-bg-primary px-3 py-2 rounded-md rounded-br-none ">
        <p >{props.message}</p>
      </div>
    </div>
  );
}

export default MessageSelf;
