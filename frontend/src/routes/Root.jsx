import React, { useEffect } from "react";
import { HomeIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getMySessions } from "@/sessions";

export const loader = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return redirect("/login");
    } else {
      const userCtx = jwtDecode(accessToken);
      const sessions = await getMySessions(userCtx.userId, accessToken);
      return { userCtx, accessToken, sessions };
    }
  } catch (error) {
    console.log(error.message);
  }
};

const Root = () => {
  const navigate = useNavigate();
  const { userCtx, accessToken } = useLoaderData();

  useEffect(() => {
    const { exp } = userCtx;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp > exp) navigate("/login");
  }, []);

  return (
    <>
      <div
        id="nav-bar"
        className="fixed left-0 right-0 top-0 z-10 bg-white px-10 py-5 text-gray-800 shadow-md"
      >
        <nav className="flex justify-between">
          <div id="logo">Logo</div>
          <div id="nav-buttons" className="flex">
            <HomeIcon size={30} className="mx-5 text-lg" />
            <SearchIcon size={30} className="mx-5 text-lg" />
            <PlusCircleIcon size={30} className="mx-5 text-lg" />
          </div>
          <div id="profile-button">Profile Button</div>
        </nav>
      </div>
      <div id="main-content" className="absolute left-0 right-0 top-20 z-0">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
