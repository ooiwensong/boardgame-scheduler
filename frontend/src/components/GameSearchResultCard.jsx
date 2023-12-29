import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import convert from "xml-js";

const GameSearchResultCard = (props) => {
  const {
    game,
    setSelectedGameTitle,
    setSelectedGameImage,
    setSelectedGameId,
    setSelectedGameYear,
    setShowSearchPortal,
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
      setSelectedGameImage(parsed.items.item.image._text);
      setSelectedGameId(parsed.items.item._attributes.id);
      setSelectedGameYear(parsed.items.item.yearpublished._attributes.value);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="my-1 w-full px-2"
        onClick={() => {
          handleClick();
          setShowSearchPortal(false);
        }}
      >
        <div className="text-left">
          {gameTitle} ({gameYear})
        </div>
      </button>
    </>
  );
};

export default GameSearchResultCard;
