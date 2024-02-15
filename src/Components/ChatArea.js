import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import Toaster from "./Toaster";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
import { sendBotRequest } from "../api/chatbotApi";
import Send_Icon from "../Images/send_icon.svg";
import { baseURI } from "../api/appApi";
import ProfilePlaceholder from "./ProfilePlaceholder";
import FileUploadIcon from "./FileUploadIcon";
import FilePreviewer from "./FilePreviewer";
import { getSocket } from "../api/socket";
import IncomingCall from "./IncomingCall";
import CallingScreen from "./DialingScreen";
import DialingScreen from "./DialingScreen";
import video_call_icon from "../Images/video_call.svg"
import getPeer from "../services/peer";
import Room from "./Room";
import voice_call_icon from "../Images/accept_call.svg";
import { VIDEO, VOICE, SCREEN_SHARE } from "../utility/constants";
import screen_share_icon from "../Images/screen_share_icon.svg";

const ENDPOINT = "http://localhost:4000";

let socket;
let peer = null;
function ChatArea() {
  // let peer = getPeer();

  if (!peer?.peer || peer?.peer.connectionState === "closed") {
    // console.log('NEW PEER CREATED... ')
    peer = getPeer();
  }

  // console.log('CHAT AREA RENDERED: ')
  const [selectedFile, setSelectedFile] = useState(null);

  // console.log('SELECTED FILE ---------------', selectedFile);
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


  // const [peer, setPeer] = useState(getPeer());
  const CALL_TYPE = useRef(null);
  // const isVideoCall = useRef(false);
  const [incoming, setIncoming] = useState(false);
  const [confrence, setConfrence] = useState(false);
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null);


  const navigate = useNavigate();
  const location = useLocation();
  const isBotChat = (location.state?.isChatbot);
  const isGroupChat = (location.state?.isGroupChat);
  const receiverId = (location.state?._id);
  const receiverLanguageType = location.state?.receiverLanguageType;


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
    console.log('RECEIVED MY SAVED MESSAGE: ', data)
    setAllMessages([...allMessages, data]);
    if (!isBotChat)
      socket.emit("new message", data);
  }


  const sendMessage = () => {
    sendMessageRequest(messageContent, chat_id)
      .then(({ data }) => {
        // console.log('RECEIVED MY SAVED MESSAGE: ', data)
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
    // console.log('USE EFFEFT ------------------- 1');
    socket = getSocket();
    socket.emit("setup", userData)
    socket.on("connected", () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    })

    socket.on("message received", (newMessage) => {
      console.log('NEW MESSAGE RECEIVED: ', newMessage)
      if (false) {
      } else {
        console.log('INSIDE ELSE')
        setAllMessages(pre => [...pre, newMessage]);
      }
    })
    return () => {
      // stopStream()
    }
  }, []);




  //  --------------- FOR webRTC --------------------

  const endCall = () => {
    socket.emit('end:call')
    stopStream();
    setConfrence(false);
    setIncoming(false);
  }

  const handleEndCall = () => {
    console.log('call ended..')
    stopStream();
    setConfrence(false);
    setIncoming(false);
  }

  const handleCallUser = useCallback(async () => {
    console.log('CALL TYPE: ', CALL_TYPE.current)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: CALL_TYPE.current === VIDEO ? true : false,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { offer, CALL_TYPE: CALL_TYPE.current });
    setMyStream(stream);
  }, [socket]);

  const handleIncommingCall = useCallback(
    async ({ offer, callType }) => {
      // setRemoteSocketId(from);
      // isVideoCall.current = isVideo;
      CALL_TYPE.current = callType
      console.log('INCOMING....', CALL_TYPE.current)
      setIncoming(true)
      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === VIDEO ? true : false,
        });
        setMyStream(stream);
        console.log(`Incoming Call`, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { ans });

      } catch (error) {
        console.log('Error occured: ', error)
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
    //user knows who accepted
    ({ ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer });
  }, [socket]);


  useEffect(() => {
    console.log('HERE----------------------------')
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!-----------------!");
      setRemoteStream(remoteStream[0]);
    });

    return () => {
      console.log("Removed listener");
      peer.peer.removeEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("Removed listener");
        setRemoteStream(remoteStream[0]);
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
      socket.emit("peer:nego:done", { ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
    setIncoming(false)
    // setDialling(false);
    setConfrence(true);
  }, []);


  const answerCall = async () => {
    // const ans = await peer.getAnswer(OFFER);
    // socket.emit("call:accepted", { ans });
    console.log('CALL ANSWERED...')
    sendStreams();
    setIncoming(false);
    // setDialling(false);
    setConfrence(true);
  }

  useEffect(() => {
    // socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("end:call", handleEndCall)

    return () => {
      //   socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("end:call", handleEndCall)

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
    // console.log('USE EFFEFT ------------------- 3');
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data.token}`,
      },
    };
    axios
      .get(`${baseURI}/message/` + chat_id, config)
      // .get(`${baseURI}/message/`, { chatId: chat_id }, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit('join chat', chat_id);
      });
  }, [refresh, chat_id, userData?.data.token]);




  const makeCall = () => {
    // alert('calling...')
    // navigate('/app/room')
    setConfrence(true);
    setIncoming(false);
    // setDialling(true);
    handleCallUser();
  }

  const stopStream = () => {
    // if (peer) {
    // peer.peer.close();
    // }

    // Stop all tracks in the local stream
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

      {incoming && <IncomingCall endCall={endCall} answerCall={answerCall} callerName={chat_user} />}

      {confrence/*confrence*/ &&
        <Room
          myStream={myStream}
          remoteStream={remoteStream}
          endCall={endCall}
          CALL_TYPE={CALL_TYPE.current}
          receiverName={chat_user}

        />
      }



      <div className={" pl-16 md:pl-4 flex items-center gap-2 px-4 py-3 bg-bg-tertary text-text-tertary " + (lightTheme ? "border-b-slate-300" : " dark border-b-slate-500")}>
        <ProfilePlaceholder name={chat_user} lightTheme={!lightTheme} />
        <p className={`text-xl capitalize ${lightTheme ? "" : " dark"}`}>
          {chat_user}
        </p>

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
      </div>

      {/* CHATS */}
      <div className={`  flex flex-col-reverse grow gap-2 p-2 pr-3 overflow-scroll hide-myscrollbar shadow-inner  ${lightTheme ? "shadow-slate-300 bg-chat-bg-light" : "  shadow-slate-600 "}`}>
        {/* <img src={Chat_bg} alt="bg" className="absolute inset-0 opacity " /> */}
        {/* <ImageChat /> */}
        {allMessages
          .slice(0)
          .reverse()
          .map((message, index) => {
            const sender = message.sender;
            const self_id = userData.data._id;
            // console.log("MESSAGE ------------------------ : ", message?.media?.mimetype);

            if (sender._id === self_id) {
              return <MessageSelf message={message.content[userData.data._id]}
                hasMedia={message?.hasMedia}
                fileName={message?.media?.filename}
                mimetype={message?.media?.mimetype}
                key={index} />;
            } else {
              // console.log("Someone Sent it--------", message);
              return <MessageOthers
                hasMedia={message?.hasMedia}
                fileName={message?.media?.filename}
                mimetype={message?.media?.mimetype}
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
              // console.log(event);
              sendMessage();
              setMessageContent("");
              // setRefresh(!refresh);
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
