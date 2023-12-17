import React, { useEffect, useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const UserCard = (props) => {
  const [user, setUser] = useState({});
  const { userCtx, accessToken } = useRouteLoaderData("root");

  const getUserProfile = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: props.userId,
        }),
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <div className="mb-3 flex">
        <div>
          <Link to={`/profile/${props.userId}`}>
            <Avatar>
              <AvatarImage src={user.avatar} />
            </Avatar>
          </Link>
        </div>
        <div className="my-auto ml-5 text-sm text-gray-500">
          {user.username ? `@${user.username}` : user.email}{" "}
          {userCtx.userId === props.userId && <i>(you)</i>}
        </div>
      </div>
    </>
  );
};

export default UserCard;
