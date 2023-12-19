import React, { useEffect } from "react";
import convert from "xml-js";

const GameSearchResultCard = (props) => {
  const {
    game,
    setSelectedGameTitle,
    setSelectedGameImage,
    setShowSearchPortal,
    selectedGame,
  } = props;

  const gameTitle = game?.name?._attributes.value;
  const gameYear = game?.yearpublished?._attributes.value;
  const gameId = game?._attributes.id;

  const handleClick = async () => {
    try {
      const res = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?stats=1&id=${gameId}`,
      );
      const data = await res.text();
      const parsed = convert.xml2js(data, { compact: true });
      setSelectedGameTitle(
        parsed.items.item.name[0]
          ? parsed.items.item.name[0]._attributes.value
          : parsed.items.item.name._attributes.value,
      );
      setSelectedGameImage(parsed.items.item.thumbnail._text);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flex w-full px-2 align-middle"
        onClick={() => {
          handleClick();
          setShowSearchPortal(false);
        }}
      >
        <div className="flex h-[30px]">
          {gameTitle} ({gameYear})
        </div>
      </button>
    </>
  );
};

export default GameSearchResultCard;
