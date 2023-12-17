import React from "react";

const GameSearchResultCard = (props) => {
  const game_id = props.game.getAttribute("id");
  const game_title = props.game.children[0].getAttribute("value");
  const game_year = props.game.children[1].getAttribute("value");
  console.log(props.game);

  return (
    <div>
      {game_title} ({game_year})
    </div>
  );
};

export default GameSearchResultCard;
