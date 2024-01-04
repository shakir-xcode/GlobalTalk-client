import React, { useEffect } from "react";
import logo from "../Images/logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Welcome() {
  console.log('WELCOME RENDERED...');
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();


  useEffect(() => {
    if (!userData) {
      console.log("User not Authenticated");
      nav("/");
    }
  })

  return (
    <div className={" flex grow flex-col justify-center items-center gap-8 flex-[0.9] w-full px-3 text-text-secondary  " + (lightTheme ? "" : " dark")}>

      <div className=" flex flex-col justify-center items-center ">
        <img src={logo} alt="Logo" className="max-w-[200px]" />
        <h1 className="  text-5xl font-bold text-bg-primary ">Global Talk</h1>
      </div>
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-2xl font-bold">Hello, {userData?.data.name} 👋</h1>
        <p className="text-lg font-semibold text-center">View and text directly to people present in the chat Rooms.</p>
      </div>
    </div>
  );
}

export default Welcome;
