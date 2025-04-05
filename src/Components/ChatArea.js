import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import Toaster from "./Toaster";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import { sendBotRequest } from "../api/chatbotApi";
import Send_Icon from "../Images/send_icon.svg";
import { baseURI } from "../api/appApi";
import ProfilePlaceholder from "./ProfilePlaceholder";
import FileUploadIcon from "./FileUploadIcon";
import FilePreviewer from "./FilePreviewer";
import { getSocket } from "../api/socket";
import IncomingCall from "./IncomingCall";
import video_call_icon from "../Images/video_call.svg"
import getPeer from "../services/peer";
import Room from "./Room";
import voice_call_icon from "../Images/accept_call.svg";
import { VIDEO, VOICE, SCREEN_SHARE } from "../utility/constants";
import screen_share_icon from "../Images/screen_share_icon.svg";
import TemporaryMessage from "./TemporaryMessage";


let socket;
let peer = null;
function ChatArea() {

  if (!peer?.peer || peer?.peer.connectionState === "closed") {
    peer = getPeer();
  }

  const [selectedFile, setSelectedFile] = useState(null);

  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id?.split("&");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);

  const [temporaryMessage, setTemporaryMessage] = useState(null);
  const [tempHasMedia, setTempHasMedia] = useState(false);
  const [tempFilename, setTempFilename] = useState(false);
  const [tempMimetype, setTempMimetype] = useState(false);

  const { refresh, setRefresh } = useContext(myContext);
 
  const [loaded, setloaded] = useState(false);
  const [botResponse, setBotResponse] = useState(null);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);


  const CALL_TYPE = useRef(null);
  const [incoming, setIncoming] = useState(false);
  const [confrence, setConfrence] = useState(false);
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);

  const location = useLocation();
  const isBotChat = (location.state?.isChatbot);
  const isGroupChat = (location.state?.isGroupChat);
  const receiverId = (location.state?._id);
  const receiverLanguageType = location.state?.receiverLanguageType;
  const webRTCUser = useRef(null);
  const callerName = useRef(null);


  const messageRoute = `${baseURI}/message/`

  const sendMessageRequest = (messageContent, chat_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    return axios
      .post(
        messageRoute,
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

  const syncMessage = data => {
    setAllMessages([...allMessages, data]);
    if (!isBotChat)
      socket.emit("new message", data);
  }

  const sendMessage = () => {
    if (messageContent.trim().length === 0) return;

    setTemporaryMessage(messageContent);
    sendMessageRequest(messageContent, chat_id)
      .then(({ data }) => {
        setTemporaryMessage(null);
        setAllMessages([...allMessages, data]);
        if (!isBotChat)
          socket.emit("new message", data);
      })
      .catch(error => {
        console.error(error)
      })

    if (isBotChat) {
      sendBotRequest(messageContent)
        .then(({ data }) => {
          // handleChatBotMessage(data.choices[0].message.content);
          handleChatBotMessage(data.message);
        })
        .catch(err => console.error(err))
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
        setAllMessages(prevMessages => [...prevMessages, data]);
      })
      .catch(console.error)
  }

  const deleteChatHandler = () => {
    alert('NOT IMPLEMENTED YET....')
  }

  useEffect(() => {
    socket = getSocket();
    socket.emit("setup", userData)
    socket.on("connected", () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    })

    socket.on("message received", (newMessage) => {
      if (false) {
      } else {
        setAllMessages(pre => [...pre, newMessage]);
      }
    })

  }, []);


  useEffect(() => {
    setAllMessages([]);
    socket.emit('join chat', chat_id);
  }, [chat_id])


  //  --------------- FOR webRTC --------------------

  const handleEndCall = () => {
    stopStream();
    setConfrence(false);
    setIncoming(false);
    setScreenSharing(false);
  }

  const handleCallUser = useCallback(async () => {
    let stream = null;
    try {
      if (CALL_TYPE.current !== SCREEN_SHARE) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: CALL_TYPE.current === VIDEO ? true : false,
        });
      }
      else {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      }

      const offer = await peer.getOffer();
      socket.emit("user:call", { offer, CALL_TYPE: CALL_TYPE.current, userId: receiverId, senderId: userData.data._id, callername: userData.data.name });
      setMyStream(stream);
    } catch (error) {
      alert(error)
      setConfrence(false)
    }
  }, [socket]);



  const handleIncommingCall = useCallback(
    async ({ offer, callType, userId, senderId, callername }) => {
      webRTCUser.current = senderId
      callerName.current = callername
      CALL_TYPE.current = callType
      // setIncoming(true)
      let stream = null;
      try {
        if (CALL_TYPE.current !== SCREEN_SHARE) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: callType === VIDEO ? true : false,
          });
          setMyStream(stream);
        }
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { ans, userId: senderId });

      } catch (error) {
        console.error('Error occured: ', error)
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);


  const handleCallAccepted = useCallback(
    ({ ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, userId: receiverId });
  }, [socket]);


  const handleScreenReceived = () => {
    setScreenSharing(true);
  }

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
      setIncoming(true)
    });

    return () => {
      peer.peer.removeEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        setRemoteStream(remoteStream[0]);
        setIncoming(true)
      });
    }
  }, [peer])

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { ans, userId: receiverId });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
    setIncoming(false)
    setConfrence(true);
  }, []);

  const answerCall = async () => {
    if (CALL_TYPE.current !== SCREEN_SHARE)
      sendStreams();
    else
      socket.emit('screen:received', { userId: receiverId })

    setIncoming(false);
    setConfrence(true);

  }

  const endCall = () => {
    socket.emit('end:call', { userId: webRTCUser.current })
    stopStream();
    setConfrence(false);
    setIncoming(false);
    setScreenSharing(false);
  }

  useEffect(() => {
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("end:call", handleEndCall)
    socket.on("screen:received", handleScreenReceived)

    return () => {
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("end:call", handleEndCall)
      socket.off("screen:received", handleScreenReceived)
    };
  }, [
    socket,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleEndCall
  ]);

  //--------------------------------------------------------

  useEffect(() => {
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

  const makeCall = () => {
    setConfrence(true);
    setIncoming(false);
    handleCallUser();
  }

  const stopStream = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }

    setMyStream(null)
    setRemoteStream(null)
  }

  return (
    <div className={`w-full flex flex-col  ${lightTheme ? "" : " dark"}`}>

      {incoming &&
        <IncomingCall
          endCall={endCall}
          answerCall={answerCall}
          callerName={callerName.current}
          CALL_TYPE={CALL_TYPE.current}
        />}

      {confrence &&
        <Room
          myStream={myStream}
          remoteStream={remoteStream}
          endCall={endCall}
          CALL_TYPE={CALL_TYPE.current}
          receiverName={chat_user}
          screenSharing={screenSharing}
        />
      }

      <div className={" pl-16 md:pl-4 flex items-center gap-2 px-4 py-3 bg-bg-tertary text-text-tertary " + (lightTheme ? "border-b-slate-300" : " dark border-b-slate-500")}>

        <ProfilePlaceholder name={chat_user} lightTheme={!lightTheme} size={10} />
        <p className={`text-xl capitalize ${lightTheme ? "" : " dark"}`}>
          {chat_user}
        </p>
        {isBotChat || isGroupChat ? ""
          :
          <div className="flex gap-5 ml-auto ">

            <div
              onClick={() => { CALL_TYPE.current = SCREEN_SHARE; makeCall() }}
              title="share screen"
              className=" w-8 p-2  rounded-full  bg-bg-primary text-xl font-bold cursor-pointer">
              <img src={screen_share_icon} alt="screen share icon" />
            </div>

            <div
              onClick={() => { CALL_TYPE.current = VOICE; makeCall() }}
              title="voice call"
              className=" w-8 p-2  rounded-full  bg-bg-primary text-xl font-bold cursor-pointer">
              <img src={voice_call_icon} alt="voice call icon" />
            </div>

            <div
              onClick={() => { CALL_TYPE.current = VIDEO; makeCall() }}
              title="video call"
              className=" w-8 p-2 rounded-full  bg-bg-primary text-xl font-bold ml-auto cursor-pointer">
              <img src={video_call_icon} alt="video call icon" />
            </div>

          </div>

        }      </div>

      {/* CHATS */}
      <div className={`flex flex-col-reverse grow gap-2 p-2 pr-3 overflow-scroll hide-myscrollbar shadow-inner  ${lightTheme ? "shadow-slate-300 bg-chat-bg-light" : "  shadow-slate-600 "}`}>

        {
          temporaryMessage ? <TemporaryMessage
            message={temporaryMessage}
            hasMedia={tempHasMedia}
            fileName={tempFilename}
            mimetype={tempMimetype}
          />
            : ""
        }

        {
          allMessages.length !== 0 || temporaryMessage !== null ?
            allMessages
              .slice(0)
              .reverse()
              .map((message, index) => {
                const sender = message.sender;
                const self_id = userData.data._id;
                if (sender._id === self_id) {
                  return <MessageSelf message={message.content[userData.data._id]}
                    hasMedia={message?.hasMedia}
                    fileName={message?.media?.filename}
                    mimetype={message?.media?.mimetype}
                    key={index} />;
                } else {
                  return <MessageOthers
                    hasMedia={message?.hasMedia}
                    fileName={message?.media?.filename}
                    mimetype={message?.media?.mimetype}
                    message={message}
                    myUserId={userData?.data._id}
                    key={index}
                    isBotChat={isBotChat}
                    isGroupChat={isGroupChat}
                    groupSender={message?.sender?.name}
                    receiverId={receiverId}
                    receiverName={chat_user}
                    lightTheme={lightTheme}
                  />
                }
              })
            :
            <div className=" w-fit mx-auto  mb-auto mt-auto text-lg md:text-2xl font-bold  text-slate-400">Your messages...</div>
        }
      </div>

      {/* MESSAGE INPUT */}

      <div className={" relative flex px-5 py-2 shadow-inner " + (lightTheme ? " bg-bg-tertary" : " dark shadow-slate-600")}>

        {selectedFile ?
          <div className=" absolute w-full z-10 bottom-0 left-0">
            <FilePreviewer
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              chatId={chat_id}
              syncMsg={syncMessage}
              lightTheme={lightTheme} />
          </div>

          : ""
        }

        <input
          placeholder="Type a Message"
          className={"w-full px-3  text-lg outline-none bg-transparent" + (lightTheme ? "" : "  ")}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
              setMessageContent("");
            }
          }}
        />

        <FileUploadIcon setSelectedFile={setSelectedFile} />

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
