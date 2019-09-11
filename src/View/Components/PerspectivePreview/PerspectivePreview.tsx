import * as React from "react";
import PerspectiveSquare from "../../../Services/PerspectiveSquare/PerspectiveSquare.service";
import OriginalPerspectiveSquareDrawer from "../../../Services/PerspectiveSquare/Drawers/Original.service";
import Vector2d from "../../../Domain/Vector/Vector2d";
import Square from "../../../Domain/Square/Square";
import Canvas from "../../UI/Canvas";
import useClickHoverWander from "../../Hooks/useClickHoverWander";

interface Props {
  width: number;
  height: number;
}

const PerspectivePreview = ({ width, height }: Props) => {
  const [
    canvasContext,
    setContext,
  ] = React.useState<CanvasRenderingContext2D | null>(null);

  const draw = React.useRef<((pos: { x: number; y: number }) => void) | null>(
    null
  );

  const mouseProps = useClickHoverWander(draw, width, height);

  React.useEffect(() => {
    const SQUARE_WIDTH = width / 4;
    if (!canvasContext) {
      return;
    }
    // Create squares
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

    // Create drawer
    const squareDrawer = new OriginalPerspectiveSquareDrawer(canvasContext, {
      mapper: (v: Vector2d) => new Vector2d(v.x, height - v.y),
      lineColor: "#04D9C4",
      includeDashes: false,
    });

    // Setup draw function
    draw.current = ({ x, y }: { x: number; y: number }) => {
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

    draw.current({ x: width / 2, y: height / 2 });
  }, [canvasContext, height, width]);

  return (
    <Canvas
      width={width}
      height={height}
      getContext={(context: CanvasRenderingContext2D) => setContext(context)}
      {...mouseProps}
    />
  );
};

export default PerspectivePreview;
