import React, { useEffect } from "react";
import "./App.css";
import MainContainer from "./Components/MainContainer";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import Welcome from "./Components/Welcome";
import ChatArea from "./Components/ChatArea";
import Users from "./Components/Users";
import CreateGroups from "./Components/CreateGroups";
import Groups from "./Components/Groups";
import { useSelector } from "react-redux";
import CallingScreen from "./Components/DialingScreen";
import { io } from "socket.io-client";
import IncomingCall from "./Components/IncomingCall";
import Room from "./Components/Room";


// let socket;
// const ENDPOINT = "http://localhost:4000";


function App() {
  // const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  useEffect(() => {
    // socket = io(ENDPOINT);
    // console.log('APP RENDERED: ', socket)

  }, [])
  return (
    <div className={"App mx-auto " + (lightTheme ? "" : "-dark")}>
      {/* <MainContainer /> */}
      {/* <Login /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />}></Route>
          <Route path="chat/:_id" element={<ChatArea />}></Route>
          <Route path="incoming" element={<IncomingCall />}></Route>
          <Route path="users" element={<Users />}></Route>
          <Route path="groups" element={<Groups />}></Route>
          <Route path="room" element={<Room />}></Route>
          <Route path="create-groups" element={<CreateGroups />}></Route>
        </Route>
      </Routes>
    </div>
  );
}


export default App;
