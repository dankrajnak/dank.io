import React, { ComponentType } from "react";
import getNextPendulum, {
  PendulumVector,
} from "../../../Services/DoublePendulum.service";
import CanvasDrawer from "../../UI/CavnasDrawer/CanvasDrawer";

export type PendulumPosition = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type CanvasInfo = {
  width: number;
  height: number;
};

type Props = {
  pendulumsInitialState: Array<PendulumVector>;
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
    pendulums: Array<PendulumPosition>,
    ctx: CanvasRenderingContext2D,
    canvasInfo: CanvasInfo
  ) => any;
};

const getPendulumCoordinates = (pendulum: PendulumVector): PendulumPosition => {
  // Get coordinates of lower mass.
  // This ImmutableJS typing is going to kill me.

  // $FlowFixMe
  const x1 = Math.sin(pendulum.get("aAngle")) * pendulum.get("aLength");
  // $FlowFixMe
  const y1 = Math.cos(pendulum.get("aAngle")) * pendulum.get("aLength");

  // $FlowFixMe
  const x2 = x1 + Math.sin(pendulum.get("bAngle")) * pendulum.get("bLength");
  // $FlowFixMe
  const y2 = y1 + Math.cos(pendulum.get("bAngle")) * pendulum.get("bLength");

  return { x1, y1, x2, y2 };
};

const _moduleExport: ComponentType<Props> = React.memo(function DoublePendulums(
  props: Props
) {
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

/**
 * Simulates chaotic pendulums utilizing the Runge-Katta algorithm
 */
export default _moduleExport;
