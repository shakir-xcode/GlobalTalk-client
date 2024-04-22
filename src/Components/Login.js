import React, { useState, useEffect } from "react";
import logo from "../Images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "./Toaster";
import DropDown from "./dropdown/DropDown";
import { baseURI } from "../api/appApi";

function Login() {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [showlogin, setShowLogin] = useState(false);
  const [data, setData] = useState({
    name: "", email: "", password: "",
    userLanguage: {
      name: null,
      ISOCode: null,
    }
  });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLogInStatus] = React.useState("");
  const [signInStatus, setSignInStatus] = React.useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/app/welcome");
    }
  }, [])


  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        `${baseURI}/user/login/`,
        data,
        config
      );
      setLogInStatus({ msg: "Success", key: Math.random() });
      setLoading(false);
      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app/welcome");
    } catch (error) {
      console.error(error)
      setLogInStatus({
        msg: "Invalid User name or Password",
        key: Math.random(),
      });
    }
    setLoading(false);
  };


  // SIGN UP 
  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        `${baseURI}/user/register/`,
        data,
        config
      );
      setSignInStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response));
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error?.response.status === 405) {
        setSignInStatus({
          msg: error.response.data.message,
          key: Math.random(),
        });
      }
      else if (error.response.status === 406) {
        setSignInStatus({
          msg: error.response.data.message,
          key: Math.random(),
        });
      }
      else {
        setSignInStatus({
          msg: error.response.data.message,
          key: Math.random(),
        });
      }

      setLoading(false);
    }
  };


  return (
    <div className="w-full h-[100dvh] flex justify-center items-center bg-bg-primary">

      <div className=" flex justify-center items-center  bg-white h-[80%] w-full">
        <div className="md:mr-[6em] lg:mr-[10em]  hidden  md:flex flex-col justify-center items-center">
          <img src={logo} alt="Logo" className="max-w-[200px]" />
          <h1 className="  text-5xl font-bold text-bg-primary ">Global Talk</h1>
        </div>
        {showlogin && (
          <div className=" rounded-lg px-7 py-10 shd flex flex-col justify-center items-center font-bold gap-5 m-2 bg-white  ">
            <p className=" text-bg-primary">Login to your Account</p>
            <div className="flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  className="bg-gray-50 border font-semibold border-gray-300 text-text-secondary  text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="username"
                  required
                  name="name"
                  onChange={changeHandler}
                />
              </div>

              <div>
                <input
                  type="password"
                  className="bg-gray-50 border font-semibold border-gray-300 text-text-secondary  text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="password"
                  required
                  name="password"
                  onChange={changeHandler}
                />
              </div>
              {/* </form> */}
              <button
                className="border border-bg-primary font-semibold rounded-md text-bg-primary px-3 py-1.5 hover:bg-bg-primary hover:text-text-primary transition self-center"
                onClick={loginHandler}
              >
                Login
              </button>
            </div>
            <p className="text-bg-primary">
              Don't have an Account ?{" "}
              <span
                className="text-accent cursor-pointer"
                onClick={() => {
                  setShowLogin(false);
                }}
              >
                Sign Up
              </span>
            </p>
            {logInStatus ? (
              <Toaster key={logInStatus.key} message={logInStatus.msg} />
            ) : null}
          </div>
        )}
        {!showlogin && (
          <div className=" rounded-lg px-7 py-10 shd flex  flex-col justify-center items-center font-bold gap-5 m-2 bg-white ">
            <p className=" text-bg-primary">Create your Account</p>
            <form onSubmit={e => e.preventDefault()} >
              <div className="flex flex-col gap-3">
                <div>
                  <input
                    className="bg-gray-50 border font-semibold border-gray-300 text-text-secondary  text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={changeHandler}
                    name="name"
                    placeholder="username"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <input
                    className="bg-gray-50 border font-semibold border-gray-300 text-text-secondary  text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={changeHandler}
                    type="email"
                    name="email"
                    placeholder="email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <input
                    className="bg-gray-50 border font-semibold border-gray-300 text-text-secondary  text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={changeHandler}
                    type="password"
                    autoComplete="current-password"
                    name="password"
                    placeholder="password"
                    required
                  />
                </div>
                {/* ----------- DROP DOWN MENU */}
                <DropDown setLanguage={setData} />
                {/* ----------- DROP DOWN MENU END ------------- */}

                {/* </form> */}
                <button
                  className="border border-bg-primary font-semibold rounded-md text-bg-primary px-3 py-1.5 hover:bg-bg-primary hover:text-text-primary transition self-center"
                  onClick={signUpHandler}
                >
                  SIGN UP
                </button>
              </div>
            </form>
            <p className="text-bg-primary">
              Already have an Account ?
              <span
                className="text-accent cursor-pointer"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Log in
              </span>
            </p>
            {signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
