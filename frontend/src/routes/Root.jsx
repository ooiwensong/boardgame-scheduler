import React, { useEffect } from "react";
import { HomeIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getMySessions } from "@/sessions";
import { Toaster } from "@/components/ui/toaster";

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
        className="fixed left-0 right-0 top-0 z-10 bg-white px-10 py-5 text-gray-800 shadow-md"
      >
        <nav className="flex justify-between">
          <div id="logo">Logo</div>
          <div id="nav-buttons" className="flex">
            <Link to="/">
              <HomeIcon size={30} className="mx-5 text-lg" />
            </Link>
            <Link to="find-session">
              <SearchIcon size={30} className="mx-5 text-lg" />
            </Link>
            <Link to="/create">
              <PlusCircleIcon size={30} className="mx-5 text-lg" />
            </Link>
          </div>
          <div id="profile-button">Profile Button</div>
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
