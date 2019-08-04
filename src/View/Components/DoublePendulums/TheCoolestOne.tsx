import React from "react";
import { makePendulum } from "../../../Services/DoublePendulum.service";
import DoublePendulums, {
  PendulumPosition,
  CanvasInfo,
} from "./DoublePendulums";

const pendulums = [];
for (let i = 0; i < 10; i++) {
  pendulums.push(makePendulum());
}

const renderPendulums = (
  pendulums: Array<PendulumPosition>,
  ctx: CanvasRenderingContext2D,
  info: CanvasInfo
) => {
  ctx.clearRect(0, 0, info.width, info.height);
  pendulums = pendulums.map(p => ({
    ...p,
    x1: p.x1 + info.width / 2,
    y1: p.y1 + info.height / 2,
    x2: p.x2 + info.width / 2,
    y2: p.y2 + info.height / 2,
  }));

  pendulums.forEach(p => {
    ctx.beginPath();
    ctx.strokeStyle = "#AAA";
    ctx.ellipse(p.x2, p.y2, 1, 1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  });

  // Draw lines between pendulums
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.moveTo(pendulums[0].x1, pendulums[0].y1);
  for (let i = 1; i < pendulums.length; i++) {
    ctx.lineTo(pendulums[i].x1, pendulums[i].y1);
  }
  ctx.lineTo(pendulums[0].x1, pendulums[0].y1);
  ctx.stroke();
};

const TheCoolestOne = (props: { width: number; height: number }) => (
  <DoublePendulums
    width={props.width}
    height={props.height}
    pendulumsInitialState={pendulums}
    renderPendulums={renderPendulums}
  />
);

export default TheCoolestOne;
