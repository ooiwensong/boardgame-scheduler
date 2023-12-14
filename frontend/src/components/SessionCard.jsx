import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import useFormatDateTime from "@/hooks/useFormatDateTime";
import { useRouteLoaderData } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MoreVertical,
  PuzzleIcon,
} from "lucide-react";
import clsx from "clsx";

const SessionCard = (props) => {
  const { session } = props;
  const { userCtx } = useRouteLoaderData("root");
  const formatted = useFormatDateTime(session);
  const [isHost, setIsHost] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    if (session.host_id === userCtx.userId) setIsHost(true);
    if (session.is_full) setIsFull(true);
  }, []);

  return (
    <Card
      className={`mt-5 border-white shadow-md ${clsx({
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
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-orange-200 active:bg-orange-300"
            >
              <MoreVertical className="text-orange-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
