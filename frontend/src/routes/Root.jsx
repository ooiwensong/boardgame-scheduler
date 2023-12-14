import React, { useEffect } from "react";
import { HomeIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const loader = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return redirect("/login");
  } else {
    const decoded = jwtDecode(accessToken);
    return { decoded, accessToken }; // Can accessToken be removed?
  }
};

const Root = () => {
  const navigate = useNavigate();
  const { decoded, accessToken } = useLoaderData();

  useEffect(() => {
    const { exp } = decoded;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp > exp) navigate("/login");
  }, []);

  return (
    <>
      <div id="nav-bar" className="px-10 py-5 text-gray-800 shadow-md">
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
      <div id="main">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
