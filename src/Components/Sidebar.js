import React, { useContext, useEffect, useState } from "react";
import PlusIcon from "../Images/plus.svg";
import Add_User_icon from "../Images/add_user_icon.svg";
import Logo from "../Images/logo_light.png";
import Groups_icon from "../Images/groups_icon.svg";
import Lightmode_icon from "../Images/lightmode_icon.svg";
import Darkmode_icon from "../Images/darkmode_icon.svg";
import Logout_icon from "../Images/logout_icon.svg";
import Search_icon from "../Images/search_icon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { myContext } from "./MainContainer";
import ProfilePlaceholder from "./ProfilePlaceholder";
import { baseURI } from "../api/appApi";

const icons_style = "w-7 cursor-pointer"

function Sidebar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const [otherParty, setOtherParty] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    console.error("User not Authenticated");
    navigate("/");
  }

  const truncateString = (str, len = 30) => {
    if (!str) return "click to start a conversation";
    if (str.length <= len) return str;
    return str.slice(0, len) + '...';
  }

  const getNames = conv => {
    return conv.map(con => {
      if (!con.isGroupChat) {
        let otherUser = con.users.find(user => user.name !== userData.data.name);
        return {
          _id: otherUser._id,
          name: otherUser?.name,
          receiverLanguageType: otherUser?.languageType
        }
      }
      return {
        name: con.chatName,
        receiverLanguageType: 'en'
      };
    })
  }

  const user = userData?.data;
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    axios.get(`${baseURI}/chat/`, config).then((response) => {
      setConversations(response.data);
      setOtherParty(getNames(response.data))

    });
  }, [refresh]);

  return (
    <div className=" flex py-2 h-full flex-col gap-2 bg-bg-primary  ">

      {/* TITLE and CREATE GROUP ICON */}
      <div className="flex justify-between mx-3">
        <img
          className="w-[52px]  " src={Logo} alt="logo"
          onClick={() => {
            navigate("/app/welcome");
          }}
        />

        {/* CREATE GROUP ICON */}
        <button
          onClick={() => {
            navigate("create-groups");
          }}
          className={`cursor-pointer p-[4px] self-center bg-text-primary 
          rounded-full hover:bg-bg-secondary hover:scale-105
          ${lightTheme ? '' : 'dark'}
          `}>
          <img src={PlusIcon} alt="icon" className="w-6" title="create group" />
        </button>
      </div>

      {/* SEARCHBAR */}
      {/* TODO: IMPLEMENT SEARCH */}
      <div className={" flex gap-3 items-center rounded-md mx-3 px-3 py-2 bg-slate-200/40"}>
        <img src={Search_icon} alt="search-icon" className="w-4" />
        <input
          placeholder="Search"
          //REMOVE: .search-box
          className={`bg-transparent text-lg font-semibold   ${lightTheme ? 'text-text-primary placeholder:text-text-primary' : 'text-text-tertary placeholder:text-slate-600'} `}
        />
      </div>

      {/* MANY ICONS */}
      <div className=" flex justify-between items-center mt-1 mx-3">

        <img alt="icon-users"
          title="search friends"
          src={Add_User_icon}
          className={icons_style}
          onClick={() => {
            navigate("users");
          }}
        />

        <img alt="icon-groups"
          title="search groups"
          src={Groups_icon}
          className={icons_style}
          onClick={() => {
            navigate("groups");
          }}
        />

        <img alt="icon-toggle-theme"
          title="toggle theme"
          src={lightTheme ? Darkmode_icon : Lightmode_icon}
          className={icons_style}
          onClick={() => {
            dispatch(toggleTheme());
          }}
        />

        <img alt="icon-logout"
          title="logout"
          src={Logout_icon}
          className={icons_style}
          onClick={() => {
            localStorage.removeItem("userData");
            navigate("/");
          }}
        />
      </div>


      <div className={` flex flex-col gap-2  grow overflow-scroll hide-myscrollbar `}>
        {conversations.length > 0 ? conversations.map((conversation, index) => {
          return (
            <div
              key={index}
              className={`px-3 py-2 cursor-pointer  flex flex-col gap-1 hover:bg-slate-200/25 ${lightTheme ? 'text-text-primary' : 'text-text-tertary'} `}
              onClick={() => {
                navigate(
                  "chat/" +
                  conversation._id +
                  "&" +
                  otherParty[index].name
                  , {
                    state: {
                      isChatbot: conversation?.isChatbot ? true : false,
                      receiverLanguageType: otherParty[index].receiverLanguageType
                      , _id: otherParty[index]._id,
                      isGroupChat: conversation.isGroupChat
                    }
                  });
              }}
            >
              <div className="flex items-center gap-2">

                <ProfilePlaceholder name={otherParty[index].name} lightTheme={lightTheme}
                  size={7}
                />

                <div>
                  <p className={` capitalize font-semibold ${lightTheme ? 'text-text-primary' : 'text-text-tertary'}`}>
                    {otherParty[index].name}
                  </p>
                  <p className="text-xs ">
                    {truncateString(conversation?.latestMessage?.content[userData?.data?._id])}
                  </p>
                </div>
              </div>

            </div>
          );
        })
          :
          <div className=" z-50 w-fit mx-auto mb-auto mt-auto text-lg md:text-xl font-semibold  text-slate-200">Loading conversations...</div>

        }
      </div>
    </div>
  );
}

export default Sidebar;
