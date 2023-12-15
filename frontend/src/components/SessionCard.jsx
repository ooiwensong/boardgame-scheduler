import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFormatDateTime from "@/hooks/useFormatDateTime";
import { useRouteLoaderData } from "react-router-dom";
import {
  ArrowLeftFromLine,
  ArrowRightToLine,
  CalendarDays,
  Clock3,
  Delete,
  MapPin,
  MoreVertical,
  PencilIcon,
  PuzzleIcon,
} from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SessionCard = (props) => {
  const { session } = props;
  const { userCtx } = useRouteLoaderData("root");
  const formatted = useFormatDateTime(session);
  const isHost = session.host_id === userCtx.userId;
  const isGuest = session.guests.includes(userCtx.userId);

  return (
    <Card
      className={`mt-5 border-0 pt-1 shadow-md ${clsx({
        "bg-orange-100": isHost,
        "bg-orange-50": !isHost,
      })}`}
    >
      <CardContent className="mt-5 px-10">
        <div className="flex">
          <div
            id="game-image"
            className="my-auto h-[70px] w-[70px] overflow-hidden rounded-full"
          >
            <img
              src={session.game_image}
              alt={session.game_title}
              className="object-cover object-center"
            />
          </div>
          <div id="session-details" className="ml-10 flex-col space-y-1">
            <b className="flex items-center">
              <PuzzleIcon size={20} className="mr-3 text-orange-600" />
              {session.game_title}
            </b>
            <p className="flex items-center">
              <CalendarDays size={20} className="mr-3 text-orange-600" />
              {formatted.date}
            </p>
            <p className="flex items-center">
              <Clock3 size={20} className="mr-3 text-orange-600" />
              {formatted.startTime} - {formatted.endTime}
            </p>
            <p className="flex items-center">
              <MapPin size={20} className="mr-3 text-orange-600" />
              {session.address}
            </p>
          </div>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-orange-200 focus:ring-0 active:bg-orange-300"
                >
                  <MoreVertical className="text-orange-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isHost && (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <PencilIcon className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Delete className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
                {!isHost && (
                  <DropdownMenuGroup>
                    {!isGuest && (
                      <DropdownMenuItem>
                        <ArrowRightToLine className="mr-2 h-4 w-4" /> Join
                        session
                      </DropdownMenuItem>
                    )}
                    {isGuest && (
                      <DropdownMenuItem>
                        <ArrowLeftFromLine className="mr-2 h-4 w-4" /> Leave
                        session
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
