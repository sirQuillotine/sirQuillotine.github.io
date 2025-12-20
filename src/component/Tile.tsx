/*import React, { Children } from "react";*/

interface Props {
  children: string;
  color?: string;
  position: number[];
  onClick: () => void;
}

const Tile = ({ children, onClick, color = "", position }: Props) => {
  return (
    <div
      onClick={onClick}
      className={"tile-" + color}
      key={position[0] + "-" + position[1]}
    >
      {children}
    </div>
  );
};

export default Tile;

/*
<div
              onClick={() => PressTile([i, j])}
              key={i + "-" + j}
              className={renderClass(tile, [i, j])}    //tile-active siinä on kirjain
            >
              {tile.toUpperCase()}
            </div>

            */
