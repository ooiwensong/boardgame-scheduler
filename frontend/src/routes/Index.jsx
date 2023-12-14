import React from "react";
import { useRouteLoaderData } from "react-router-dom";
import SessionsDisplay from "../components/SessionsDisplay";

const Index = () => {
  const { sessions } = useRouteLoaderData("root");

  return (
    <>
      <SessionsDisplay sessions={sessions}>Upcoming Sessions</SessionsDisplay>
    </>
  );
};

export default Index;
