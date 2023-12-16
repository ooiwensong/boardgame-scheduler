import React, { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import SessionsDisplay from "../components/SessionsDisplay";

const Index = () => {
  const { userCtx, accessToken } = useRouteLoaderData("root");
  const [sessions, setSessions] = useState([]);

  const getSessions = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/api/sessions/my-sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userCtx.userId,
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
    getSessions();
  }, []);

  return (
    <>
      <SessionsDisplay sessions={sessions} getSessions={getSessions}>
        Upcoming Sessions ({sessions.length})
      </SessionsDisplay>
    </>
  );
};

export default Index;
