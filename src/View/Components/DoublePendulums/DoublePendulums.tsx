import * as React from "react";
import getNextPendulum, {
  PendulumVector,
} from "../../../Services/DoublePendulum.service";
import CanvasDrawer from "../../UI/CavnasDrawer/CanvasDrawer";

export interface PendulumPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CanvasInfo {
  width: number;
  height: number;
}

interface Props {
  pendulumsInitialState: PendulumVector[];
  /**
   * Width of the canvas
   */
  width: number;
  /**
   * Height of the canvas
   */
  height: number;
  /**
   * Function which draws the pendulums onto the canvas
   */
  renderPendulums: (
    pendulums: PendulumPosition[],
    ctx: CanvasRenderingContext2D,
    canvasInfo: CanvasInfo
  ) => any;
}

const getPendulumCoordinates = (pendulum: PendulumVector): PendulumPosition => {
  // Get coordinates of lower mass.

  const aAngle = pendulum.get("aAngle") || 0;
  const aLength = pendulum.get("aLength") || 0;
  const bAngle = pendulum.get("bAngle") || 0;
  const bLength = pendulum.get("bLength") || 0;

  const x1 = Math.sin(aAngle) * aLength;
  const y1 = Math.cos(aAngle) * aLength;

  const x2 = x1 + Math.sin(bAngle) * bLength;
  const y2 = y1 + Math.cos(bAngle) * bLength;

  return { x1, y1, x2, y2 };
};

/**
 * Simulates chaotic pendulums utilizing the Runge-Katta algorithm
 */
export default React.memo(function DoublePendulums(props: Props) {
  let pendulums = props.pendulumsInitialState;
  const drawPendulums = (context: CanvasRenderingContext2D) => {
    props.renderPendulums(
      pendulums.map(pendulum => getPendulumCoordinates(pendulum)),
      context,
      { width: props.width, height: props.height }
    );
    pendulums = pendulums.map(getNextPendulum);
  };
  return (
    <CanvasDrawer
      width={props.width}
      height={props.height}
      artist={drawPendulums}
    />
  );
});
