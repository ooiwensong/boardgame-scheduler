import React from "react";
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
import { Link, useRouteLoaderData } from "react-router-dom";
import {
  ArrowLeftFromLine,
  ArrowRightToLine,
  CalendarDays,
  Clock3,
  MapPin,
  PencilIcon,
  PuzzleIcon,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SessionCard = (props) => {
  const { session, getSessions } = props;
  const { toast } = useToast();
  const { userCtx, accessToken } = useRouteLoaderData("root");

  const formatted = useFormatDateTime(session);
  const isHost = session.host_id === userCtx.userId;
  const isGuest = session.guests.includes(userCtx.userId);

  const handleJoinSession = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/api/sessions/join-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userCtx.userId,
            sessionId: session.uuid,
          }),
        },
      );
      getSessions();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLeaveSession = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/api/sessions/leave-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userCtx.userId,
            sessionId: session.uuid,
          }),
        },
      );
      getSessions();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteSession = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/sessions/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId: session.uuid,
        }),
      });
      getSessions();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Card
      className={`mt-5 border-0 pt-1 shadow-md ${clsx({
        "bg-orange-100": isHost,
        "bg-orange-50": !isHost && isGuest,
        "bg-slate-100": !isHost && !isGuest,
      })}`}
    >
      <CardContent className="mt-5 pl-10 pr-7">
        <div className="flex">
          <div
            id="game-image"
            className="my-auto h-[70px] w-[70px] overflow-hidden rounded-full"
          >
            <img
              src={session.game_image}
              alt={session.game_title}
              className="object-cover"
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
            {isHost && (
              <div className="relative -right-3 -top-2 flex-row">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link to="/create">
                        <Button
                          variant="ghost"
                          className="mr-1 h-fit rounded-full p-2 hover:bg-orange-50"
                        >
                          <PencilIcon className=" text-orange-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-fit rounded-full p-2 hover:bg-orange-50"
                          >
                            <XCircle className=" text-orange-600" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the scheduled session.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => {
                            handleDeleteSession();
                            toast({
                              title: "Session deleted",
                              description: `${session.game_title} on ${formatted.date}`,
                            });
                          }}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipProvider>
              </div>
            )}
            {!isHost && (
              <>
                {!isGuest && (
                  <div className="relative -right-2 -top-2 flex-row">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            className="h-fit rounded-full p-2 hover:bg-orange-100"
                            disabled={session.is_full}
                            onClick={() => {
                              handleJoinSession();
                              toast({
                                title: "🎉 Yay! Session joined! 🎉",
                                description: `${session.game_title} on ${formatted.date}`,
                              });
                            }}
                          >
                            <ArrowRightToLine className=" text-orange-600" />
                          </Button>
                          <TooltipContent>
                            <p>Join session</p>
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
                {isGuest && (
                  <div className="relative -right-2 -top-2 flex-row">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            className="h-fit rounded-full p-2 hover:bg-orange-200"
                            onClick={() => {
                              handleLeaveSession();
                              toast({
                                title: "You have left the session",
                                description: "Sorry to see you go!",
                              });
                            }}
                          >
                            <ArrowLeftFromLine className=" text-orange-600" />
                          </Button>
                          <TooltipContent>
                            <p>Leave session</p>
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
