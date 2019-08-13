import React from "react";

const Board = props => {
  const ball = {
    left: props.x + 7 + "px",
    bottom: props.y + "px",
  };

  const leftPaddle = {
    left: 0,
    bottom: props.left + "px"
  };

  const rightPaddle = {
    right: 0,
    bottom: props.right + "px"
  };

  return (
    <div className="game-board">
      <span className="game-ball" style={ball} />
      <span className="game-paddle" style={leftPaddle} />
      <span className="game-paddle" style={rightPaddle} />
    </div>
  );
};

export default Board;