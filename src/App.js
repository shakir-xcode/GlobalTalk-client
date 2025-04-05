import React from "react";
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
import IncomingCall from "./Components/IncomingCall";
import Room from "./Components/Room";
import {ping} from "./utility/pingServer";
import {baseURI} from "./api/appApi";


ping(baseURI);

function App() {
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <div className={"App mx-auto " + (lightTheme ? "" : "-dark")}>

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
