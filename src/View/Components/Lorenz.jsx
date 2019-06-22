// @flow
import React, { type ComponentType, useRef } from "react";
import * as ColorInterpolate from "color-interpolate";
import getNextPosition, {
  type Position,
} from "../../Services/StrangeAttractor.service";
import CanvasDrawer from "../UI/CanvasDrawer.jsx";
import { Map } from "immutable";

type Props = {
  width: number,
  height: number,
};

const mapper = (
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
) => (mapValue: number) =>
  ((mapValue - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow) + toLow;

const colorInterpolator = ColorInterpolate([
  "#F58B73",
  "#F26A7C",
  "#BD4EB2",
  "#894EAB",
  "#554396",
]);

let position: Position = Map({ x: 10, y: 10, z: 25 + Math.random() * 10 - 5 });
export default (React.memo(function Lorenz(props: Props) {
  const xMapper = mapper(-20, 20, 0, props.width);
  const yMapper = mapper(0, 50, 0, props.height);
  const colorMapper = mapper(0, 40, 0, 1);

  // Start the animation!
  const artist = (context: CanvasRenderingContext2D) => {
    // Draw the thing
    context.fillStyle = colorInterpolator(colorMapper(position.get("z")));
    context.fillRect(0, 0, props.width, props.height);

    context.fillStyle = "#EEE";
    context.beginPath();
    context.ellipse(
      xMapper(position.get("x")),
      yMapper(position.get("z")),
      5,
      5,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
    context.closePath();
    // Figure out the next position of this.
    position = getNextPosition(position);
  };

  const initializeCanvas = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#2f3030";
    context.strokeStyle = "#EEE";
    context.lineWidth = 0.5;
  };

  return (
    <CanvasDrawer
      artist={artist}
      initializeCanvas={initializeCanvas}
      width={props.width}
      height={props.height}
      fps={50}
    />
  );
}): ComponentType<Props>);
