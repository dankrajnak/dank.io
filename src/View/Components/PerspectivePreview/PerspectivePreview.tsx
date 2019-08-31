import * as React from "react";
import PerspectiveSquare from "../../../Services/PerspectiveSquare/PerspectiveSquare.service";
import OriginalPerspectiveSquareDrawer from "../../../Services/PerspectiveSquare/Drawers/Original.service";
import Vector2d from "../../../Domain/Vector/Vector2d";
import Square from "../../../Domain/Square/Square";
import Canvas from "../../UI/Canvas";
import throttle from "../../../Services/Throttle/Throttle.service";

interface Props {
  width: number;
  height: number;
}

const PerspectivePreview = ({ width, height }: Props) => {
  const [
    canvasContext,
    setContext,
  ] = React.useState<CanvasRenderingContext2D | null>(null);

  const onMouseMove = React.useRef<((event: React.MouseEvent) => void) | null>(
    null
  );

  React.useEffect(() => {
    const SQUARE_WIDTH = width / 4;
    if (!canvasContext) {
      return;
    }
    const squareOne = new PerspectiveSquare(
      new Square(
        SQUARE_WIDTH,
        new Vector2d((width - SQUARE_WIDTH) / 2, (height + SQUARE_WIDTH) / 4)
      ),
      50
    );

    const squareTwo = new PerspectiveSquare(
      new Square(
        SQUARE_WIDTH,
        new Vector2d(
          (width - SQUARE_WIDTH) / 2,
          (3 * (height + SQUARE_WIDTH)) / 4
        )
      ),
      50
    );

    const squareDrawer = new OriginalPerspectiveSquareDrawer(canvasContext, {
      mapper: (v: Vector2d) => new Vector2d(v.x, height - v.y),
      lineColor: "#04D9C4",
    });
    const draw = (x: number, y: number) => {
      canvasContext.fillStyle = "#0D0D0D";
      canvasContext.fillRect(0, 0, width, height);
      squareDrawer.draw(
        squareOne.getSquares(new Vector2d(x, height - y)),
        new Vector2d(x, y)
      );
      squareDrawer.draw(
        squareTwo.getSquares(new Vector2d(x, height - y)),
        new Vector2d(x, y)
      );
    };
    onMouseMove.current = throttle((event: React.MouseEvent) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      draw(x, y);
    }, 25);
    draw(width / 2, height / 2);
  }, [canvasContext, height, width]);

  return (
    <Canvas
      width={width}
      height={height}
      getContext={(context: CanvasRenderingContext2D) => setContext(context)}
      onMouseMove={(event: React.MouseEvent) =>
        onMouseMove.current && onMouseMove.current(event)
      }
    />
  );
};

export default PerspectivePreview;
