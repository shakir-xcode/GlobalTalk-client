import React, { useState } from "react";
import "./myStyles.css";
import { useSelector } from "react-redux";
import ProfilePlaceholder from "./ProfilePlaceholder";
import ImageChat from './ImageChat';

function MessageOthers(props) {
  const [otherVersion, setOtherVersion] = useState(false);
  const lightTheme = useSelector((state) => state.themeKey);

  // const avatarGenerator = (name, color = '3f3e3e', bgColor = 'e0e0e0') => {
  //   return `https://ui-avatars.com/api/?name=${name}=true&bold=true&background=${bgColor}&color=${color}`
  // }

  return (
    <div>

      <div className=" w-fit max-w-[350px] ml-6 mr-10  ">
        {
          (props.isBotChat || props.isGroupChat) ?
            ((props.hasMedia) ?
              <ImageChat filename={props.fileName} mimetype={props.mimetype} selfMessage={false} />
              :
              <div className={"rounded-lg rounded-bl-none flex flex-col " + (lightTheme ? "bg-bg-primary" : " bg-slate-500/25")}>

                <p className={" px-2 py-3 text"}>
                  {props.message?.content[props.myUserId] || props.message?.content[props.receiverId]}
                </p>
              </div>
            )
            : (
              (props.hasMedia) ?
                <ImageChat filename={props.fileName} mimetype={props.mimetype} selfMessage={false} />
                :
                <div className={" rounded-lg rounded-bl-none flex flex-col " + (lightTheme ? "bg-bg-primary" : " bg-slate-500/25")}>
                  <p className={" px-2 py-3 text"}>
                    {otherVersion ?
                      props.message?.content[props.receiverId]
                      :
                      props.message?.content[props.myUserId] || props.message?.content[props.receiverId]
                    }
                    <button
                      className=" mt-1 ml-auto cursor-pointer text-xs block italic"
                      onClick={() => setOtherVersion(pre => !pre)}>{otherVersion ? 'hide original' : 'show original'}</button>
                  </p>
                </div>
            )

        }
      </div>

      <div className="">
        <ProfilePlaceholder name={props.receiverName} lightTheme={!lightTheme} size={6} />
      </div>

    </div>
  );
}

export default MessageOthers;
