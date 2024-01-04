import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import logo from "../Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import Refresh_icon from "../Images/refresh_icon.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import { baseURI } from "../api/appApi";
import ProfilePlaceholder from "./ProfilePlaceholder";

function Groups() {
  console.log('GROUPS RENDERED...');
  const { refresh, setRefresh } = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [groups, SetGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData?.data;
  useEffect(() => {
    // console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    axios
      .get(`${baseURI}/chat/fetchGroups`, config)
      .then((response) => {
        const newGroups = response.data.filter(group => group.users.find(item => item === user._id) === undefined)
        SetGroups(newGroups);
      });
  }, [refresh]);

  return (
    <div className="w-full flex flex-col "
    >
      <div className={" shadow border-b  shadow-slate-400 flex justify-between items-center gap-3 px-4 py-3 bg-bg-secondary text-text-tertary " + (lightTheme ? "border-b-slate-300" : " dark border-b-slate-500")}>
        <img
          src={logo}
          style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
        />
        <p className="text-xl font-semibold">
          Available Groups
        </p>
        <img
          title="refresh"
          alt="refresh_icon"
          src={Refresh_icon}
          className={"w-8 rounded-full cursor-pointer p-[5px] hover:bg-slate-200/50 hover:scale-110"}
          onClick={() => {
            setRefresh(!refresh);
          }}
        />
      </div>

      <div className="grow flex flex-col overflow-scroll  hide-myscrollbar">
        {groups.map((group, index) => {
          return (
            <div
              className={"border-b px-4 py-3 flex items-center gap-3 cursor-pointer " + (lightTheme ? "hover:bg-slate-100" : " border-b-slate-600 text-text-primary hover:bg-slate-700")}
              key={index}
              onClick={() => {
                // console.log("Creating chat with group", group.chatName);
                const config = {
                  headers: {
                    Authorization: `Bearer ${userData.data.token}`,
                  },
                };
                axios.put(
                  `${baseURI}/chat/addSelfToGroup`,
                  {
                    userId: user._id,
                    chatId: group._id
                  },
                  config
                ).then(() => {
                  // dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                })
                  .catch(err => console.log(err.message))
              }}
            >

              <ProfilePlaceholder name={group.chatName} lightTheme={lightTheme} />

              <p className={" text-lg font-semibold " + (lightTheme ? "text-slate-800" : " ")}>
                {group.chatName}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Groups;
