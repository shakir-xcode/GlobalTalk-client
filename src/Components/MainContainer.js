import React, { createContext, useState } from "react";
import "./myStyles.css";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavDrawer from "./NavDrawer";

export const myContext = createContext();

function MainContainer() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);

  return (
    <div className={` ${lightTheme ? "" : " dark"}
    w-full, h-[100dvh] flex grow
    `}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>

        <div className="flex-[0.3] ">
          <div className=" h-[100dvh] hidden md:block"><Sidebar /></div>
          <div className=" w-full  block md:hidden"><NavDrawer /></div>
        </div>
        <div className="md:flex-[0.9] flex w-full "><Outlet /></div>
      </myContext.Provider>
    </div>
  );
}

export default MainContainer;
