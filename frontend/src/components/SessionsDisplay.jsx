import React, { useState } from "react";
import SessionCard from "./SessionCard";

const SessionsDisplay = (props) => {
  return (
    <>
      <div
        id="sessions-main-content-wrapper"
        className="container mb-5 max-w-5xl"
      >
        <div id="main-content-header">
          <h1 className="mt-10 text-4xl font-bold">{props.children}</h1>
        </div>
        <div id="main-content-body" className="mt-8">
          <div id="display">
            {props.sessions.map((session) => {
              return (
                <SessionCard
                  key={session.uuid}
                  session={session}
                  setSessions={props.setSessions}
                  getSessions={props.getSessions}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionsDisplay;
