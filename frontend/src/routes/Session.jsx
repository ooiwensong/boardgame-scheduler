import useFormatDateTime from "@/hooks/useFormatDateTime";
import {
  ArrowLeftFromLine,
  ArrowRightToLine,
  CalendarDays,
  Clock3,
  MapPin,
  PencilIcon,
  Puzzle,
  UsersRound,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useParams,
  useRouteLoaderData,
  Link,
  useNavigate,
} from "react-router-dom";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import UserCard from "@/components/UserCard";

const Session = () => {
  const [sessionData, setSessionData] = useState({});
  const [sessionGuests, setSessionGuests] = useState([]);
  const { userCtx, accessToken } = useRouteLoaderData("root");
  const params = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatted = useFormatDateTime(sessionData);
  const isHost = userCtx.userId === sessionData.host_id;
  const isGuest = sessionGuests
    ? sessionGuests.some((guest) => guest.guest_id === userCtx.userId)
    : false;

  const getSingleSession = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId: params.sessionId,
        }),
      });
      const data = await res.json();
      setSessionData(data.sessionData);
      setSessionGuests(data.sessionGuests);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getSingleSession();
  }, []);

  const handleJoinSession = async () => {
    try {
      await fetch(import.meta.env.VITE_SERVER + "/api/sessions/join-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userCtx.userId,
          sessionId: params.sessionId,
        }),
      });
      getSingleSession();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLeaveSession = async () => {
    try {
      await fetch(import.meta.env.VITE_SERVER + "/api/sessions/leave-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userCtx.userId,
          sessionId: params.sessionId,
        }),
      });
      getSingleSession();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await fetch(import.meta.env.VITE_SERVER + "/api/sessions/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId: params.sessionId,
        }),
      });
      getSingleSession();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        id="session-main-content-wrapper"
        className="container mb-5 mt-10 max-w-5xl"
      >
        <section
          id="session"
          className={`rounded-md border border-gray-300 px-10 py-5 shadow-md ${clsx(
            {
              "bg-orange-100": isHost,
              "bg-orange-50": !isHost && isGuest,
              "bg-slate-100": !isHost && !isGuest,
            },
          )}`}
        >
          <div id="session-first-half" className="flex pt-5">
            <div
              id="avatar"
              className="flex h-[200px] w-[200px] justify-center overflow-hidden rounded"
            >
              <img src={sessionData.game_image} alt={sessionData.game_title} />
            </div>
            <div id="single-session-details" className="flex flex-col">
              <div
                id="game-title"
                className="mb-3 ml-10 flex items-center text-3xl"
              >
                <Puzzle size={25} className="mr-3 text-orange-600" />
                <p>{sessionData.game_title}</p>
              </div>
              <div
                id="session-date"
                className="mb-3 ml-10 flex items-center text-xl"
              >
                <CalendarDays size={25} className="mr-3 text-orange-600" />
                <p>{formatted.date}</p>
              </div>
              <div
                id="session-time"
                className="mb-3 ml-10 flex items-center text-xl"
              >
                <Clock3 size={25} className="mr-3 text-orange-600" />
                <p>
                  {formatted.startTime} - {formatted.endTime}
                </p>
              </div>
              <div
                id="session-address"
                className="mb-3 ml-10 flex items-center text-xl"
              >
                <MapPin size={25} className="mr-3 text-orange-600" />
                <p>{sessionData.address}</p>
              </div>
              <div
                id="session-guest-slots"
                className="mb-3 ml-10 flex items-center text-xl"
              >
                <UsersRound size={25} className="mr-3 text-orange-600" />
                <p>
                  {sessionData.num_guests} of {sessionData.max_guests} guest
                  slots filled
                </p>
              </div>
              {formatted.lastUpdated && (
                <div
                  id="single-session-last-updated"
                  className="ml-10 mt-10 text-sm text-gray-500"
                >
                  <i>Last updated: {formatted.lastUpdated} ago</i>
                </div>
              )}
            </div>
            <div id="single-session-buttons" className="ml-auto">
              {isHost && (
                <div className="relative -right-5 -top-5 flex-row">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={`/profile/${sessionData.host_id}/session/${sessionData.uuid}/edit`}
                        >
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
                                description: `${sessionData.game_title} on ${formatted.date}`,
                              });
                              navigate("/");
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
                    <div className="relative -right-5 -top-5 flex-row">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              className="h-fit rounded-full p-2 text-orange-600 hover:bg-orange-100 disabled:text-gray-400"
                              disabled={sessionData.is_full}
                              onClick={() => {
                                handleJoinSession();
                                toast({
                                  title: "🎉 Yay! Session joined! 🎉",
                                  description: `${sessionData.game_title} on ${formatted.date}`,
                                });
                              }}
                            >
                              <ArrowRightToLine className="text-inherit" />
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
                    <div className="relative -right-5 -top-5 flex-row">
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
          <Separator className="my-10 " />
          <div id="session-second-half">
            <div id="single-session-host">
              <div className="mb-5 text-xl">
                <i>Host</i>
              </div>
              <UserCard
                key={sessionData.host_id}
                userId={sessionData.host_id}
              />
            </div>
            <div id="single-session-guests">
              <div className="mb-5 mt-10 text-xl">
                <i>Guests</i>
              </div>
              {sessionGuests && sessionGuests.length !== 0 ? (
                sessionGuests.map((guest) => (
                  <UserCard key={guest.guest_id} userId={guest.guest_id} />
                ))
              ) : (
                <i className="text-gray-500">
                  No one has joined this session yet...
                </i>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Session;
