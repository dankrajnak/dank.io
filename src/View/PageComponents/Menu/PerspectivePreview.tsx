import * as React from "react";
import PerspectiveSquare from "../../../Services/PerspectiveSquare/PerspectiveSquare.service";
import OriginalPerspectiveSquareDrawer from "../../../Services/PerspectiveSquare/Drawers/Original.service";
import Vector2d from "../../../Domain/Vector/Vector2d";
import Square from "../../../Domain/Square/Square";
import useClickHoverWander from "../../Hooks/useClickHoverWander";
import CanvasDrawer from "../../UI/CavnasDrawer/CanvasDrawer";
import PersepctiveSquareDrawer from "../../../Services/PerspectiveSquare/Drawers/Drawer.interface";

interface Props {
  width: number;
  height: number;
}

const PerspectivePreview = ({ width, height }: Props) => {
  const squares = React.useRef<[PerspectiveSquare, PerspectiveSquare] | null>(
    null
  );
  const squareDrawer = React.useRef<PersepctiveSquareDrawer | null>(null);

  const [focusPoint, mouseProps] = useClickHoverWander(width, height);

  const initializeCanvas = (ctx: CanvasRenderingContext2D) => {
    const SQUARE_WIDTH = width / 4;

    // Create squares
    squares.current = [
      new PerspectiveSquare(
        new Square(
          SQUARE_WIDTH,
          new Vector2d((width - SQUARE_WIDTH) / 2, (height + SQUARE_WIDTH) / 4)
        ),
        50
      ),
      new PerspectiveSquare(
        new Square(
          SQUARE_WIDTH,
          new Vector2d(
            (width - SQUARE_WIDTH) / 2,
            (3 * (height + SQUARE_WIDTH)) / 4
          )
        ),
        50
      ),
    ];

    // Create drawer
    squareDrawer.current = new OriginalPerspectiveSquareDrawer(ctx, {
      mapper: (v: Vector2d) => new Vector2d(v.x, height - v.y),
      lineColor: "#04D9C4",
      includeDashes: false,
    });
  };
  const artist = (ctx: CanvasRenderingContext2D) => {
    if (!squareDrawer.current || !squares.current) {
      return null;
    }
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, width, height);
    squareDrawer.current.draw(
      squares.current[0].getSquares(
        new Vector2d(focusPoint.x, height - focusPoint.y)
      ),
      focusPoint
    );
    squareDrawer.current.draw(
      squares.current[1].getSquares(
        new Vector2d(focusPoint.x, height - focusPoint.y)
      ),
      focusPoint
    );
  };

  return (
    <CanvasDrawer
      width={width}
      height={height}
      initializeCanvas={initializeCanvas}
      artist={artist}
      {...mouseProps}
    />
  );
};

export default PerspectivePreview;
