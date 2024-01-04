import React, { useContext, useEffect, useState } from "react";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import Toaster from "./Toaster";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
import { sendBotRequest } from "../api/chatbotApi";
import Profile_Placeholder from "../Images/profile_placeholder.jpg";
import Chat_bg from "../Images/chat_bg2.png";
import Send_Icon from "../Images/send_icon.svg";
import { baseURI } from "../api/appApi";
import ProfilePlaceholder from "./ProfilePlaceholder";
import ImageChat from "./ImageChat";
// wss endpoint
const ENDPOINT = "http://localhost:4000";

let socket;

function ChatArea() {
  console.log('CHAT AREA RENDERED');
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [botResponse, setBotResponse] = useState(null);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const location = useLocation();
  const isBotChat = (location.state?.isChatbot);
  const isGroupChat = (location.state?.isGroupChat);
  const receiverId = (location.state?._id);
  const receiverLanguageType = location.state?.receiverLanguageType;


  const avatarGenerator = (name, color = '3f3e3e', bgColor = 'e0e0e0') => {
    return `https://ui-avatars.com/api/?name=${name}=true&bold=true&background=${bgColor}&color=${color}`
  }

  const sendMessageRequest = (messageContent, chat_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    return axios
      .post(
        `${baseURI}/message/`,
        {
          content: messageContent,
          chatId: chat_id,
          senderLanguageType: userData.data.languageType,
          receiverLanguageType,
          receiverId,
          isGroupChat,
        },
        config
      )

  }

  const sendMessage = () => {
    sendMessageRequest(messageContent, chat_id)
      .then(({ data }) => {
        console.log('RECEIVED MY SAVED MESSAGE: ', data)
        setAllMessages([...allMessages, data]);
        if (!isBotChat)
          socket.emit("new message", data);
      })
      .catch(error => {
        console.log(error)
      })

    if (isBotChat) {
      sendBotRequest(messageContent)
        .then(({ data }) => {
          console.log('BOT API RESPONDED: ', data)
          handleChatBotMessage(data.choices[0].message.content);
        })
        .catch(err => console.log(err))
    }
  };



  const handleChatBotMessage = (msgData) => {
    axios.post(`${baseURI}/message/botMessage`,
      {
        content: msgData,
        chatId: chat_id,
      }
    )
      .then(({ data }) => {
        console.log('BOT SAVED message response: ', data)
        setAllMessages(prevMessages => [...prevMessages, data]);
      })
      .catch(console.log)
  }

  const deleteChatHandler = () => {
    alert('NOT IMPLEMENTED YET....')
  }

  useEffect(() => {
    console.log('USE EFFEFT ------------------- 1');
    socket = io(ENDPOINT);
    socket.emit("setup", userData)
    socket.on("connected", () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    })

    socket.on("message received", (newMessage) => {
      console.log('NEW MESSAGE: ', newMessage)
      if (false) {
      } else {
        console.log('INSIDE ELSE')
        setAllMessages(pre => [...pre, newMessage]);
      }
    })
  }, []);

  useEffect(() => {
    console.log('USE EFFEFT ------------------- 2');
    console.log('ALL MESSAGES', allMessages);
  })

  useEffect(() => {
    console.log('USE EFFEFT ------------------- 3');
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data.token}`,
      },
    };
    axios
      .get(`${baseURI}/message/` + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit('join chat', chat_id);
      });
  }, [refresh, chat_id, userData?.data.token]);

  return (
    <div className={`w-full flex flex-col  ${lightTheme ? "" : " dark"}`}>

      <div className={" pl-16 md:pl-4 flex items-center gap-3 px-4 py-3 bg-bg-tertary text-text-tertary " + (lightTheme ? "border-b-slate-300" : " dark border-b-slate-500")}>
        {/* <img src={avatarGenerator(chat_user, 'fff', '0f83ff')} alt="profile" className="w-8 rounded-full" /> */}
        <ProfilePlaceholder name={chat_user} lightTheme={!lightTheme} />
        <p className={`text-2xl font-semibold ${lightTheme ? "" : " dark"}`}>
          {chat_user}
        </p>
      </div>

      {/* CHATS */}
      <div className={`  flex flex-col-reverse grow gap-2 p-2 overflow-scroll hide-myscrollbar shadow-inner  ${lightTheme ? "shadow-slate-300 bg-chat-bg-light" : "  shadow-slate-600 "}`}>
        {/* <img src={Chat_bg} alt="bg" className="absolute inset-0 opacity " /> */}
        <ImageChat />
        {allMessages
          .slice(0)
          .reverse()
          .map((message, index) => {
            const sender = message.sender;
            const self_id = userData.data._id;
            if (sender._id === self_id) {
              // console.log("I sent it : ", message.content);
              return <MessageSelf message={message.content[userData.data._id]} key={index} />;
            } else {
              // console.log("Someone Sent it");
              return <MessageOthers
                hasMedia={message?.hasMedia}
                mediaTitle={message?.media.title}
                mediaUri={message?.media.mediaUri}
                message={message}
                myUserId={userData?.data._id}
                key={index}
                isBotChat={isBotChat}
                isGroupChat={isGroupChat}
                receiverId={receiverId}
                receiverName={chat_user}
                lightTheme={lightTheme}
              />
            }
          })}
      </div>

      {/* MESSAGE INPUT */}
      <div className={" flex px-5 py-2 shadow-inner " + (lightTheme ? " bg-bg-tertary" : " dark shadow-slate-600")}>
        <input
          placeholder="Type a Message"
          className={"w-full px-3  text-lg outline-none bg-transparent" + (lightTheme ? "" : "  ")}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              // console.log(event);
              sendMessage();
              setMessageContent("");
              // setRefresh(!refresh);
            }
          }}
        />
        <div className="p-2 bg-bg-primary rounded-full cursor-pointer hover:opacity-80"
          onClick={() => {
            sendMessage();
            setMessageContent("");
            setRefresh(!refresh);
          }}
        >
          <img
            src={Send_Icon}
            className={" w-7 "}

          />
        </div>
      </div>
      {botResponse && <Toaster key={botResponse.key} message={botResponse.msg} />}
    </div>
  );
}

export default ChatArea;
