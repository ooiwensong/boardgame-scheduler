import React, { useEffect, useState } from "react";
import GameSearchResultCard from "@/components/GameSearchResultCard";
import convert from "xml-js";

const GameSearchResults = (props) => {
  const [gamesArray, setGamesArray] = useState([]);

  useEffect(() => {
    const parsed = convert.xml2js(props.gamesData, { compact: true });
    setGamesArray(
      Array.isArray(parsed.items?.item)
        ? parsed.items?.item
        : [parsed.items?.item],
    );
  }, [props.gamesData]);

  return (
    <div className=" border-5 absolute z-10 mt-1 max-h-[200px] min-h-fit w-[400px] overflow-auto rounded-sm border border-red-600 bg-white">
      {!gamesArray[0] ? (
        <div className="h-fit p-1">
          <i>No matching results...</i>
        </div>
      ) : (
        gamesArray.map((game) => {
          return (
            <GameSearchResultCard
              key={game?._attributes.id}
              game={game}
              selectedGame={props.selectedGame}
              setSelectedGameTitle={props.setSelectedGameTitle}
              setSelectedGameImage={props.setSelectedGameImage}
              setShowSearchPortal={props.setShowSearchPortal}
            />
          );
        })
      )}
    </div>
  );
};

export default GameSearchResults;
