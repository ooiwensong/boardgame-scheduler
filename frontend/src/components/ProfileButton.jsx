import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ProfileButton = () => {
  const { userCtx } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const isAdmin = userCtx.role === "ADMIN";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={userCtx.avatar} className="" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link to={`/profile/${userCtx.userId}`}>My profile</Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem>
              <Link to="/admin">Admin</Link>
            </DropdownMenuItem>
          )}
          <Separator />
          <DropdownMenuItem
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileButton;
