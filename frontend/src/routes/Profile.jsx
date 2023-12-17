import SessionsDisplay from "@/components/SessionsDisplay";
import useFormatDateTime from "@/hooks/useFormatDateTime";
import React, { useEffect, useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";

const Profile = () => {
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState({});
  const { accessToken } = useRouteLoaderData("root");
  const params = useParams();

  const { createdAt } = useFormatDateTime(profile);

  const getUserProfile = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: params.userId,
        }),
      });
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSessions = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/api/sessions/host-sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: params.userId,
          }),
        },
      );
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
    getSessions();
  }, []);

  return (
    <>
      <div
        id="profile-main-content-wrapper"
        className="container mb-5 mt-10 max-w-5xl"
      >
        <section
          id="profile"
          className="flex rounded-md border border-gray-300 px-10 py-5 shadow-md"
        >
          <div
            id="avatar"
            className="h-[200px] w-[200px] overflow-hidden rounded-full"
          >
            <img src={profile.avatar} alt="user avatar" />
          </div>
          <div id="profile-details" className=" flex flex-col">
            <div id="profile-handle" className="ml-10 text-4xl">
              <h1>
                {profile.username ? `@${profile.username}` : profile.email}
              </h1>
            </div>
            <div
              id="profile-handle"
              className="ml-10 mt-auto text-sm text-gray-500"
            >
              <i>Member since: {createdAt}</i>
            </div>
          </div>
        </section>
      </div>
      <SessionsDisplay sessions={sessions} getSessions={getSessions}>
        Host sessions
      </SessionsDisplay>
    </>
  );
};

export default Profile;
