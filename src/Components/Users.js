import React, { useContext, useEffect, useState } from "react";
import Profile_Placeholder from "../Images/profile_placeholder.jpg";
import "./myStyles.css";
import Refresh_icon from "../Images/refresh_icon.svg";
import logo from "../Images/logo.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import { baseURI } from "../api/appApi";
import ProfilePlaceholder from "./ProfilePlaceholder";

function Users() {
  console.log('USERS RENDERED...');
  // const [refresh, setRefresh] = useState(true);
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();


  useEffect(() => {
    if (!userData) {
      console.log("User not Authenticated");
      nav(-1);
    }
  })

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data.token}`,
      },
    };
    axios.get(`${baseURI}/user/fetchUsers`, config).then((data) => {
      // console.log("UData refreshed in Users panel ");
      setUsers(data.data);
      // setRefresh(!refresh);
    });
  }, [refresh]);

  return (
    <div
      className=" w-full flex flex-col "
    >
      <div className={" shadow border-b  shadow-slate-400 flex justify-between items-center gap-3 px-4 py-3 bg-bg-secondary text-text-tertary " + (lightTheme ? "border-b-slate-300" : " dark border-b-slate-500")}>
        <img
          src={logo}
          style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
        />
        <p className="text-xl font-semibold">
          Available Users
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

      <div className="">
        {users.map((user, index) => {
          return (
            <div
              className={"border-b px-4 py-3 flex items-center gap-3 cursor-pointer " + (lightTheme ? "hover:bg-slate-100" : " border-b-slate-600 text-text-primary hover:bg-slate-700")}
              key={index}
              onClick={() => {
                const config = {
                  headers: {
                    Authorization: `Bearer ${userData.data.token}`,
                  },
                };
                axios.post(
                  `${baseURI}/chat/`,
                  {
                    userId: user._id,
                  },
                  config
                );
                // dispatch(refreshSidebarFun());
                setRefresh(!refresh);

              }}
            >
              {/* <img src={Profile_Placeholder} alt="profile" className="w-10 rounded-full" /> */}
              <ProfilePlaceholder name={user.name} lightTheme={lightTheme} />

              <p className={" text-lg font-semibold " + (lightTheme ? "text-slate-800" : " ")}>
                {user.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;
