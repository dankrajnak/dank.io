import * as React from "react";
import CanvasDrawer from "../../UI/CavnasDrawer/CanvasDrawer";

interface Props {
  width: number;
  height: number;
}

interface Sphere {
  x: number;
  y: number;
  color: string;
}

const HallwayPreview = ({ width, height }: Props) => {
  const spheres = React.useRef<Sphere[]>([
    { x: width / 2, y: height / 2, color: "#ee6666" },
    { x: width / 2, y: height / 2, color: "#333388" },
  ]);
  const renderNumber = React.useRef(0);
  const artist = React.useRef((ctx: CanvasRenderingContext2D) => {
    renderNumber.current = renderNumber.current + 1;

    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, width, height);

    spheres.current.forEach((sphere, index) => {
      ctx.fillStyle = sphere.color;
      ctx.beginPath();
      ctx.ellipse(
        sphere.x + Math.sin(renderNumber.current * 0.016 + index) * 100,
        sphere.y + Math.sin(renderNumber.current * 0.012 + index) * 100,
        10,
        10,
        0,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    });
  });

  return <CanvasDrawer width={width} height={height} artist={artist.current} />;
};

export default React.memo(HallwayPreview);
