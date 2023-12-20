import SessionsDisplay from "@/components/SessionsDisplay";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { matchSorter } from "match-sorter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const FindSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [date, setDate] = useState("");
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
    if (searchInput) {
      const sorted = matchSorter(data, searchInput, {
        keys: ["game_title", "address"],
      });
      setSessions(sorted);
    } else {
      setSessions(data);
    }
  }

  useEffect(() => {
    getSessions();
  }, [searchInput]);

  return (
    <>
      <div
        id="filter-bar"
        className=" border-1 sticky left-0 right-0 top-12 z-50 flex justify-around border bg-white py-4"
      >
        <div id="filter-text-input" className="w-[300px]">
          <Input
            placeholder="Search title or location"
            className="rounded-full bg-gray-100 px-5"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <div id="filter-date-input">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[300px] justify-start rounded-full text-left font-normal text-muted-foreground"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Pick a date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <SessionsDisplay sessions={sessions} getSessions={getSessions}>
        {sessions.length} sessions
      </SessionsDisplay>
    </>
  );
};

export default FindSessions;
