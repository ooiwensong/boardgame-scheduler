import GameSearchResults from "@/components/GameSearchResults";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast, useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";

const Edit = () => {
  const [sessionData, setSessionData] = useState({});
  const [date, setDate] = useState();
  const [games, setGames] = useState("");
  const { userCtx, accessToken } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();

  const formRef = useRef();
  const titleRef = useRef();

  // const getGames = async (query) => {
  //   try {
  //     const res = await fetch(
  //       `https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`,
  //     );
  //     const data = await res.text();
  //     setGames(data);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

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
      setDate(new Date(data.sessionData.date));
    } catch (error) {
      console.log(error.message);
    }
  };

  const editSession = async () => {
    const formData = new FormData(formRef.current);
    const UpdatedGameData = Object.fromEntries(formData);
    UpdatedGameData.host_id = userCtx.userId;
    UpdatedGameData.date = date;
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "/api/sessions/" + params.sessionId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(UpdatedGameData),
        },
      );
      if (res.ok) {
        return res;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userCtx.userId !== params.userId) {
      navigate("/");
    }
    getSingleSession();
  }, []);

  return (
    <>
      <div
        id="create-main-content-wrapper"
        className="container mb-5 mt-10 max-w-5xl"
      >
        <h1 className="mt-10 text-4xl font-bold">Edit your session</h1>
        <section
          id="create"
          className="flex rounded-md border border-gray-300 px-10 py-5 shadow-md"
        >
          <Form
            ref={formRef}
            method="put"
            className="flex w-[400px] flex-col space-y-5"
          >
            <div id="create-title">
              <Label className="text-md">Title</Label>
              <Input
                ref={titleRef}
                name="game_title"
                type="text"
                defaultValue={sessionData.game_title}
                className="active: ring-orange-400"
                // onChange={(e) => {
                //   getGames(e.target.value);
                // }}
              />
              {/* {titleRef.current?.value && <GameSearchResults games={games} />} */}
            </div>
            <div id="create-max-guests">
              <Label className="text-md">Max Guests</Label>
              <Select name="max_guests">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the number of guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div id="create-date">
              <Label className="text-md">Date</Label>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "texted-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "iii, dd MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div id="create-start-time">
              <Label className="text-md">Start Time</Label>
              <Input
                name="start_time"
                type="time"
                step="120"
                defaultValue={sessionData.start_time}
              />
            </div>
            <div id="create-end-time">
              <Label className="text-md">End Time</Label>
              <Input
                name="end_time"
                type="time"
                defaultValue={sessionData.end_time}
              />
            </div>
            <div id="create-address">
              <Label className="text-md">Address</Label>
              <Input
                name="address"
                type="text"
                defaultValue={sessionData.address}
              />
            </div>
            <div className="border-5 border-red-500 pt-5">
              <Button
                type="button"
                className="mt-100 w-full bg-blue-500 hover:bg-blue-600"
                onClick={async () => {
                  const res = await editSession();
                  console.log(res);
                  if (res.ok) {
                    toast({
                      title: "Your session has been updated",
                    });
                    navigate("/");
                  }
                }}
              >
                Save changes
              </Button>
            </div>
          </Form>
        </section>
      </div>
    </>
  );
};

export default Edit;
