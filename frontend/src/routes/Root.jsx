import React from "react";
import { HomeIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { Outlet, redirect } from "react-router-dom";

export const loader = () => {
  return redirect("/login");
};

const Root = () => {
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
