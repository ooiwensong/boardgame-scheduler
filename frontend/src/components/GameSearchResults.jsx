import React, { useEffect, useState } from "react";
import GameSearchResultCard from "./GameSearchResultCard";

const GameSearchResults = (props) => {
  const [gamesArray, setGamesArray] = useState([]);
  const parser = new DOMParser();

  useEffect(() => {
    const gamesXMLDoc = parser.parseFromString(props.games, "text/xml");
    setGamesArray(gamesXMLDoc.getElementsByTagName("item"));
    // console.log(gamesXMLDoc.getElementsByTagName("item"));
    // console.log(gamesXMLDoc);
    console.log(gamesArray);
  }, []);

  return (
    <div className=" border-5 absolute z-10 mt-1 max-h-[200px] min-h-fit w-[400px] overflow-auto rounded-sm border border-red-600 bg-white">
      {gamesArray.map((game, idx) => {
        <GameSearchResultCard key={idx} game={game} />;
      })}
    </div>
  );
};

export default GameSearchResults;
