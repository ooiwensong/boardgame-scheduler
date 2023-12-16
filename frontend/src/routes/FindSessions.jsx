import SessionsDisplay from "@/components/SessionsDisplay";
import React, { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const FindSessions = () => {
  const [sessions, setSessions] = useState([]);
  const { userCtx, accessToken } = useRouteLoaderData("root");

  async function getSessions() {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/api/sessions/other-user-sessions",
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
  }

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <>
      <SessionsDisplay sessions={sessions} getSessions={getSessions}>
        {sessions.length} sessions
      </SessionsDisplay>
    </>
  );
};

export default FindSessions;
