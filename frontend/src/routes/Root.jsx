import React, { useEffect } from "react";
import { HomeIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import {
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "@/components/ui/toaster";
import ProfileButton from "@/components/ProfileButton";

export const loader = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return redirect("/login");
    } else {
      const userCtx = jwtDecode(accessToken);
      return { userCtx, accessToken };
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

const Root = () => {
  const navigate = useNavigate();
  const { userCtx } = useLoaderData();

  useEffect(() => {
    const { exp } = userCtx;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp > exp) navigate("/login");
  }, []);

  return (
    <>
      <div
        id="nav-bar"
        className="fixed left-0 right-0 top-0 z-10 bg-white px-10 text-gray-800 shadow-md"
      >
        <nav className="mt-3 flex justify-between">
          <div id="logo">Logo</div>
          <div id="nav-buttons" className="mb-1 flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-orange-600 text-orange-600"
                  : "text-black-600"
              }
            >
              <HomeIcon size={30} className="mx-5 mb-3 text-lg" />
            </NavLink>
            <NavLink
              to="find-session"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-orange-600 text-orange-600"
                  : "text-black-600"
              }
            >
              <SearchIcon size={30} className="mx-5 mb-3 text-lg" />
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-orange-600 text-orange-600"
                  : "text-black-600"
              }
            >
              <PlusCircleIcon size={30} className="mx-5 mb-3 text-lg" />
            </NavLink>
          </div>
          <div id="profile-button">
            <ProfileButton />
          </div>
        </nav>
      </div>
      <div id="main-content" className="absolute left-0 right-0 top-20 z-0">
        <Outlet />
      </div>
      <Toaster className="mt-5" />
    </>
  );
};

export default Root;
