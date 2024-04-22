import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import Tick_icon from "../Images/tick_icon.svg";
import { baseURI } from "../api/appApi";



function CreateGroups() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { refresh, setRefresh } = useContext(myContext);
  const [active, setActive] = useState(true);
  const dispatch = useDispatch();
  const nav = useNavigate();


  useEffect(() => {
    if (!userData) {
      console.error("User not Authenticated");
      nav("/");
    }
  })

  const user = userData?.data;
  const [groupName, setGroupName] = useState(`${userData?.data.name} Group`);

  const createGroup = () => {
    if (!active) return;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setActive(false);
    axios.post(
      `${baseURI}/chat/createGroup`,
      {
        name: groupName,
        users: '[]',
      },
      config
    ).then(() => {
      setRefresh(!refresh);
    })
      .catch(console.log)
      .finally(
        () => {
          setActive(true);
          nav("/app/groups");
        }
      )
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center grow">

      <div className={"font-bold text-2xl " + (lightTheme ? "text-text-secondary" : " dark")}>
        Create Group
      </div>

      <form
        onSubmit={e => e.preventDefault()}
        className={"border border-slate-500 max-w-[360px] text-lg font-semibold self-center px-2 py-4 rounded-md flex justify-between text-text-tertary" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Enter Group Name"
          required
          className={"w-full px-3 " + (lightTheme ? "" : " dark")}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />

        <div className="w-fit relative">
          <img
            title="ok"
            alt="ok"
            src={Tick_icon}
            className=" w-9 cursor-pointer p-1 border border-[#a0a0a0] rounded-full hover:bg-slate-200/40 hover:scale-110 transition"
            onClick={() => {
              createGroup();
            }}
          />
          <input
            onClick={() => {
              createGroup();
            }}
            className=" absolute inset-0 p-2 rounded-full cursor-pointer hover:bg-slate-200/40 " type="submit" value="" />

        </div>
      </form>

    </div >
  );
}

export default CreateGroups;
